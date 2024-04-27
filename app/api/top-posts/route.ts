import { getDisscussionListByPage } from "@/lib/database/discussion";
import { getTopComments } from "@/lib/database/get-comment-list";
import { getPostById, getPostByIds, getPostsByDiscussionId, getPostsByDiscussionIds } from "@/lib/database/old/post";
import { HashEmojiAvatar } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    let discussions = await getTopComments('8964', 3)
    return new NextResponse(JSON.stringify({
        data: discussions,
        code: 1
    }))
}
