import supabase from '@/lib/database/database';
import { HashEmojiAvatar } from '@/lib/utils';

export const getDisscussionListByPage = async (page = 1, pageSize = 20) => {
    const { data, error } = await supabase
        .from('discussions')
        .select('*')
        .order('id', { ascending: false })
        .range(page * pageSize - pageSize, page * pageSize - 1);
    if (error) {
        throw error;
    }
    data.forEach((discussion: any) => {
        discussion.user_id = HashEmojiAvatar({ user_id: discussion.user_id ? discussion.user_id : 'anonymous' })
    })
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