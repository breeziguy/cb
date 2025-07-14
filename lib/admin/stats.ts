import { supabase } from '@/lib/supabase-admin';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getTotalCustomers() {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer');
  if (error) {
    console.error('Error fetching total customers:', error);
    return 0;
  }
  return count ?? 0;
}

export async function getTotalCreators() {
    const { count, error } = await supabase
      .from('creators')
      .select('id', { count: 'exact', head: true });
    if (error) {
        console.error('Error fetching total creators:', error);
        return 0;
    }
    return count ?? 0;
}

export async function getTotalBriefs() {
    const { count, error } = await supabase
        .from('briefs')
        .select('*', { count: 'exact', head: true });
    if (error) {
        console.error('Error fetching total briefs:', error);
        return 0;
    }
    return count ?? 0;
}

export async function getBriefsLast12Months() {
    const { data, error } = await supabase.rpc('get_briefs_last_12_months');

    if (error) {
        console.error('Error fetching briefs last 12 months:', error);
        return [];
    }
    return data;
}

export async function getTopCreators() {
    const { data, error } = await supabase.rpc('get_top_creators_by_brief_count');

    if (error) {
        console.error('Error fetching top creators:', error);
        return [];
    }
    
    return data;
} 