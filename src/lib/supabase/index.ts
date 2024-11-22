import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import 'dotenv/config';

require('dotenv').config();

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);
