import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  is_approved: boolean
  approved: boolean
  created_at: string
}

export type RSVP = {
  id: number
  name: string
  email: string | null
  phone: string | null
  will_attend: boolean
  number_of_guests: number | null // Alterado para permitir null
  dietary_restrictions: string | null
  message: string | null
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean; // Adicionado is_admin
};