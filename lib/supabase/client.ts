import { createClient } from "@supabase/supabase-js"

// Forçando os valores corretos para eliminar o erro de conexão.
const supabaseUrl = "https://ebbygtitglsunqozqfgx.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViYnlndGl0Z2xzdW5xb3pxZmd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDg2NzQsImV4cCI6MjA3MTIyNDY3NH0.piwgVaCUrmksr4oqMUNPoYbuqnHDq3Fj_LauE9AQZ1c"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Adicionando logs para depuração
console.log("Supabase client initialized with URL:", supabaseUrl);
console.log("Supabase client initialized with anon key (first 10 chars):", supabaseAnonKey.substring(0, 10) + "...");

export type Gift = {
  id: number
  name: string
  description: string | null
  price_range: string | null
  store_link: string | null
  image_url: string | null
  is_purchased: boolean
  purchased_by: string | null
  created_at: string
}

export type Message = {
  id: number
  author_name: string
  author_email: string | null
  message: string
  approved: boolean
  created_at: string
}

export type Confirmation = {
  id: number
  name: string
  created_at: string
}

export type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  is_admin: boolean
}