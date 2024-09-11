import { getDisscussionListByPage } from "@/lib/database/discussion";
import { getRandomComments } from "@/lib/database/get-comment-list";
import { getReviewInfo } from "@/lib/database/get-prof-info";
import { getPostById, getPostByIds, getPostsByDiscussionId, getPostsByDiscussionIds } from "@/lib/database/old/post";
import { HashEmojiAvatar } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: NextRequest) {
    let discussions = await getRandomComments('8964', 10)
    return new NextResponse(JSON.stringify({
        data: discussions,
        code: 1
    }))
}
