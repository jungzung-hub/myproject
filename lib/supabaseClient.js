import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // .env.local 에 값이 비어 있으면 여기서 바로 알 수 있도록 콘솔에 남겨둡니다.
  console.warn(
    "Supabase 환경변수가 비어 있습니다. .env.local의 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 값을 확인해 주세요."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
