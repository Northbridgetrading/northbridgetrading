
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qbrhpbnhoinlmmskzmsy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_H3B2h2cv2ZE8KhuqnhLDmQ_3OH7MAiA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

