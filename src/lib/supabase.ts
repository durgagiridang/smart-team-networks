import { createClient } from '@supabase/supabase-js'

// सिधै यहाँ भ्यालु राखेर चेक गरौँ (केही बेरका लागि मात्र)
const supabaseUrl = 'https://pvtxiqaldtjruwqmwqmq.supabase.co';
const supabaseAnonKey = 'sb_publishable_TVW2ybWLH7guPsZ82mX70Q_0Y1JFJmH';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);