import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// Para melhor suporte de tipagem no IDE para Deno, você pode adicionar um tsconfig.json
// na pasta supabase/functions com a configuração:
// {
//   "compilerOptions": {
//     "lib": ["deno.ns", "deno.window"],
//     "strict": true
//   }
// }

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => { // Corrigido: req tipado como Request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, first_name, last_name } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email e senha são obrigatórios.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Crie um cliente Supabase com a chave de função de serviço
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Crie o usuário
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { first_name, last_name },
      email_confirm: true, // Confirma automaticamente o e-mail para usuários criados pelo admin
    });

    if (userError) {
      console.error('Erro ao criar usuário:', userError);
      return new Response(JSON.stringify({ error: userError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const userId = userData.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'ID do usuário não encontrado após a criação.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Atualize o perfil para definir is_admin como true
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ is_admin: true, first_name, last_name })
      .eq('id', userId);

    if (profileError) {
      console.error('Erro ao definir usuário como admin:', profileError);
      // Se a atualização do perfil falhar, considere excluir o usuário criado acima
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(JSON.stringify({ error: profileError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: 'Usuário admin criado com sucesso!', userId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) { // Corrigido: error tipado como unknown
    console.error('Erro na Função Edge:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), { // Corrigido: cast para Error
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});