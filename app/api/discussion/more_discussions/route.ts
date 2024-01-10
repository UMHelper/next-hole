import { getDisscussionListByPage } from "@/lib/database/discussion";
import { getPostById, getPostsByDiscussionId } from "@/lib/database/post";
import { HashEmojiAvatar } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const page = url.searchParams.get('page')
    if (page === null) {
        return new NextResponse(JSON.stringify({ code: 0 }))
    }
    let discussions = await getDisscussionListByPage(parseInt(page)+1)
    discussions = await Promise.all(
        discussions.map(async (discussion: any) => {
            // discussion.first_post = await getPostById(discussion.first_post_id)
            
            discussion.reply_post = await getPostsByDiscussionId(discussion.id)

            discussion.first_post = discussion.reply_post.filter((post: any) => post.id === discussion.first_post_id)[0]
            discussion.reply_post = discussion.reply_post.filter((post: any) => post.id !== discussion.first_post_id)
            return discussion
        }))
    return new NextResponse(JSON.stringify({
        data: discussions,
        code: 1
    }))
}
