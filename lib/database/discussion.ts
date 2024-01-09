import supabase from '@/lib/database/database';

export const getDisscussionListByPage = async (page = 1, pageSize = 20) => {
    const { data, error } = await supabase
        .from('discussions')
        .select('*')
        .order('id', { ascending: false })
        .range(page * pageSize - pageSize, page * pageSize - 1);
    if (error) {
        throw error;
    }
    return data;
}

export const getDisscussionCount = async () => {
    const { data, error }: { data: any, error: any } = await supabase
        .from('discussions')
        .select('id', { count: 'exact' })
    if (error) {
        throw error;
    }
    return data.length;
}