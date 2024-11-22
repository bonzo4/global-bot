import { supabase } from 'src/lib/supabase';

export async function searchUser(userString: string) {
  const { data: data1 } = await supabase
    .from('users')
    .select()
    .eq('display_name', userString)
    .single();

  if (data1) return data1;

  const { data: data2 } = await supabase
    .from('users')
    .select()
    .eq('username', userString)
    .single();

  if (data2) return data2;

  const { data: data3 } = await supabase
    .from('users')
    .select()
    .eq('id', userString)
    .single();

  if (data3) return data3;

  return null;
}
