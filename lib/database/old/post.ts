import supabase from '@/lib/database/database';
import { getVotesByPostId, getVotesByPostIds } from '@/lib/database/old/vote';
import { REACTION_EMOJI_LIST } from '@/lib/consant';
import { HashEmojiAvatar } from '@/lib/utils';

export const getPostById = async (id: number) => {
    const { data, error } = await supabase
        .from('flarum_posts')
        .select('*')
        .eq('id', id)
        .single();
    if (data === null) {
        return []
    }
    data.vote_history = await getVotesByPostId(id);
    if (data.vote_history=== null) {
        data.vote_history = [];
    }
    data.vote_statics = REACTION_EMOJI_LIST.map((emoji) => {
        return{
            emoji:emoji,
            count:data.vote_history.filter((vote:any)=>vote.offset===emoji).length
        }
    })
    data.user_id=HashEmojiAvatar({user_id:data.user_id?data.user_id:'anonymous'})

    return data;
}

export const getPostByIds = async (ids: number[]) => {
    const { data, error } = await supabase
        .from('flarum_posts')
        .select('*')
        .in('id', ids);
    if (error) {
        throw error;
    }
    data.forEach((post:any)=>{
        post.user_id=HashEmojiAvatar({user_id:post.user_id?post.user_id:'anonymous'})
        post.vote_history=[]
    })

    const votes=await getVotesByPostIds(ids)
    votes.forEach((vote:any)=>{
        data.find((post:any)=>post.id===vote.post_id).vote_history.push(vote)
    })

    data.forEach((post:any)=>{
        post.vote_statics=REACTION_EMOJI_LIST.map((emoji)=>{
            return{
                emoji:emoji,
                count:post.vote_history.filter((vote:any)=>vote.offset===emoji).length
            }
        })
    })
    return data;

}

export const getPostsByDiscussionId = async (discussion_id: number) => {
    const { data, error } = await supabase
        .from('flarum_posts')
        .select('*')
        .eq('discussion_id', discussion_id)
        .order('id', { ascending: true });
    if (error) {
        throw error;
    }
    data.forEach((post:any)=>{
        post.user_id=HashEmojiAvatar({user_id:post.user_id?post.user_id:'anonymous'})
        post.vote_history=[]
    })

    const ids=data.map((post:any)=>post.id)
    const votes=await getVotesByPostIds(ids)
    votes.forEach((vote:any)=>{
        data.find((post:any)=>post.id===vote.post_id).vote_history.push(vote)
    })

    data.forEach((post:any)=>{
        post.vote_statics=REACTION_EMOJI_LIST.map((emoji)=>{
            return{
                emoji:emoji,
                count:post.vote_history.filter((vote:any)=>vote.offset===emoji).length
            }
        })
    })
    return data;
}

export const getPostsByDiscussionIds = async (discussion_ids: number[]) => {
    const { data, error } = await supabase
        .from('flarum_posts')
        .select('*')
        .in('discussion_id', discussion_ids)
        .order('id', { ascending: true });
    if (error) {
        throw error;
    }
    data.forEach((post:any)=>{
        post.user_id=HashEmojiAvatar({user_id:post.user_id?post.user_id:'anonymous'})
        post.vote_history=[]
    })

    const ids=data.map((post:any)=>post.id)
    const votes=await getVotesByPostIds(ids)
    // const votes:any[]=[]
    votes.forEach((vote:any)=>{
        data.find((post:any)=>post.id===vote.post_id).vote_history.push(vote)
    })

    data.forEach((post:any)=>{
        post.vote_statics=REACTION_EMOJI_LIST.map((emoji)=>{
            return{
                emoji:emoji,
                count:post.vote_history.filter((vote:any)=>vote.offset===emoji).length
            }
        })
    })
    return data;
}