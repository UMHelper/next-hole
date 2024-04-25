import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CalendarRange, Cat, ChevronRightCircle, ClipboardEdit } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getCommentList, getVoteHistory } from "@/lib/database/get-comment-list";
import Link from "next/link";
import { notFound } from 'next/navigation'

import { Comments } from "@/components/comments";
import { Viewport } from "next";

export const revalidate = 0
export const dynamic = "force-dynamic";

export function generateMetadata(
    { params }: { params: any }) {
    const title = `WHOLE @ UM`

    return {
        title: title,
    }

}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

const ReviewPage = async ({ params }: { params: { } }) => {

    const comments:any[] = await getCommentList(8964);
    const comments_id_array = comments.map((comment) => comment.id)
    const vote_history:any[] = await getVoteHistory(comments_id_array)


    return (
        <>
            <div>
                <div className='max-w-screen-xl mx-auto p-4'>
                    <Comments comments={comments} course_id={8964} vote_history={vote_history}/>
                </div>
            </div>
        </>
    )
}

export default ReviewPage