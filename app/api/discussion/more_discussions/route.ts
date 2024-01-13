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

    console.time('getDisscussionListByPage')
    let discussions = await getDisscussionListByPage(parseInt(page) + 1)
    console.timeEnd('getDisscussionListByPage')

    console.time('getPostByIds')
    const discussion_ids = discussions.map((discussion: any) => discussion.id)
    const posts = await getPostsByDiscussionIds(discussion_ids)
    discussions = discussions.map((discussion: any) => {
        discussion.first_post = posts.find((post: any) => post.id === discussion.first_post_id)
        discussion.reply_post = posts.filter((post: any) => post.id !== discussion.first_post_id && post.discussion_id === discussion.id)

        return discussion
    })
    console.timeEnd('getPostByIds')
    return new NextResponse(JSON.stringify({
        data: discussions,
        code: 1
    }))
}
