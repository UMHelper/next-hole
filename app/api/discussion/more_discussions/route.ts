import { getDisscussionListByPage } from "@/lib/database/discussion";
import { getPostById, getPostByIds, getPostsByDiscussionId, getPostsByDiscussionIds } from "@/lib/database/post";
import { HashEmojiAvatar } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const page = url.searchParams.get('page')
    if (page === null) {
        return new NextResponse(JSON.stringify({ code: 0 }))
    }
    let discussions = await getDisscussionListByPage(parseInt(page) + 1)
    // discussions = await Promise.all(
    // discussions.map(async (discussion: any) => {
    // discussion.first_post = await getPostById(discussion.first_post_id)

    // discussion.reply_post = await getPostsByDiscussionId(discussion.id)

    // discussion.first_post = discussion.reply_post.filter((post: any) => post.id === discussion.first_post_id)[0]
    // discussion.reply_post = discussion.reply_post.filter((post: any) => post.id !== discussion.first_post_id)
    // return discussion
    // }))

    // const first_post_ids = discussions.map((discussion: any) => discussion.first_post_id ? discussion.first_post_id : null).filter((id: any) => id !== null)
    // const first_posts = await getPostByIds(first_post_ids)
    // discussions = discussions.map((discussion: any) => {
    //     discussion.first_post = first_posts.find((post: any) => post.id === discussion.first_post_id)
    //     return discussion
    // })
    const discussion_ids = discussions.map((discussion: any) => discussion.id)
    const posts = await getPostsByDiscussionIds(discussion_ids)
    discussions = discussions.map((discussion: any) => {
        discussion.first_post = posts.find((post: any) => post.id === discussion.first_post_id)
        // discussion.first_post.user_id = HashEmojiAvatar({ user_id: discussion.first_post.user_id ? discussion.first_post.user_id : 'anonymous' })
        discussion.reply_post = posts.filter((post: any) => post.id !== discussion.first_post_id && post.discussion_id === discussion.id)
        // discussion.reply_post.forEach((post: any) => {
        //     post.user_id = HashEmojiAvatar({ user_id: post.user_id ? post.user_id : 'anonymous' })
        // })
        return discussion
    })
    return new NextResponse(JSON.stringify({
        data: discussions,
        code: 1
    }))
}
