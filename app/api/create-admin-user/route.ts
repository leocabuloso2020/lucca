import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, first_name, last_name } = await req.json();
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Get the current admin's token

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided.' }, { status: 401 });
    }

    // Invoke the Supabase Edge Function
    const supabaseFunctionUrl = `https://ebbygtitglsunqozqfgx.supabase.co/functions/v1/create-admin-user`; // Replace with your actual Supabase Project ID

    const response = await fetch(supabaseFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Pass the current admin's token to the Edge Function
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Pass anon key for function invocation
      },
      body: JSON.stringify({ email, password, first_name, last_name }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error from Edge Function:', data);
      return NextResponse.json({ error: data.error || 'Failed to create admin user via Edge Function.' }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}