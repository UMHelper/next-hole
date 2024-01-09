import supabase from '@/lib/database/database';

export const getVotesByIds = async (ids: number[]) => {
    const { data, error } = await supabase
        .from('votes')
        .select('*')
        .in('id', ids);
    if (error) {
        throw error;
    }
    return data;
}