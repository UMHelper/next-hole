import supabase from '@/lib/database/database';

export const getVotesByIds = async (ids: number[]) => {
    const { data, error } = await supabase
        .from('votes')
        .select('*')
        .in('post_id', ids);
    if (error) {
        throw error;
    }
    return data;
}

export const getVotesByPostId = async (postId: number) => {
    const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('post_id', postId);
    if (error) {
        throw error;
    }
    return data;
}

export const getVotesByPostIds = async (postIds: number[]) => {
    const { data, error } = await supabase
        .from('votes')
        .select('*')
        .in('post_id', postIds);
    if (error) {
        throw error;
    }
    return data;
}