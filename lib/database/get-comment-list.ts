import supabase from '@/lib/database/database';

export const getCommentList = async (course_id: number) => {

    const {data, error} = await supabase.from('comment').select('*')
    console.log(data)
    console.log(error)
    //return data as any[]
    return data ? data.reverse().filter((comment:any)=>comment.hidden!==1) as any[] : []
}

export const getCommentNumber = async (course_id: string,prof:string) => {
    const {data, error} = await supabase.from('comment').select('*')
    return data ? data.length : 0
}

export const getVoteHistory = async (comment_id_array:string[]) => {
    const {data, error} = await supabase.from('vote').select('*').in('comment_id', comment_id_array)
    // console.log(data)
    return data as any[]
}