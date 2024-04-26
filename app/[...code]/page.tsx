import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CalendarRange, Cat, ChevronRightCircle, ClipboardEdit } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getComentListByCourseIDAndPage, getCommentList, getVoteHistory } from "@/lib/database/get-comment-list";
import Link from "next/link";
import { notFound } from 'next/navigation'

import { Comments } from "@/components/comments";
import { Viewport } from "next";
import { getReviewInfo } from "@/lib/database/get-prof-info";
import { ReviewReload } from "@/components/review-reload";
import { ReviewPagination } from "@/components/review-pagination";

export const revalidate = 0
export const dynamic = "force-dynamic";

export function generateMetadata(
    { params }: { params: any }) {
    const title = `TEST WHOLE @ UM`

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

const ReviewPage = async ({ params }: { params: { code: string[] } }) => {

    let page_num = 1;

    let code = params.code.join('/').replaceAll('%2C', ",").toLowerCase();
    if (!Number.isNaN(parseInt(params.code[params.code.length - 1]))) {
        page_num = parseInt(params.code.pop() as string);
        code = params.code.join('/').replaceAll('%2C', ",").toLowerCase();
    }

    console.log(code)
    console.log(page_num)

    const prof_info = await getReviewInfo(code);

    console.log(prof_info)

    if (prof_info == undefined) {
        return (
            notFound()
        )
    }

    const comments: any[] = await getComentListByCourseIDAndPage(prof_info.id, page_num - 1);
    const comments_id_array = comments.map((comment) => comment.id)
    const vote_history: any[] = await getVoteHistory(comments_id_array)



    return (
        <>

            <div className='bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-6'>
                <div className='max-w-screen-xl mx-auto p-4'>
                    <div className='flex flex-col md:flex-row justify-between'>
                        <div className="py-3">
                            <div className='text-base font-semibold'>{prof_info['title_eng'].toUpperCase()}</div>
                            <div className='pb-3 flex-row flex space-x-2 mt-3'>
                                <div className='font-bold text-3xl break-all'>{prof_info['title_chi']}</div>
                            </div>
                        </div>

                        <div className="content-center">
                            <div className='flex-row flex space-x-2'>
                                <Link href={'/submit/' + code}>
                                    <Button className='text-sm px-2 hover:shadow-lg bg-white text-blue-800 hover:bg-gray-200'>
                                        <ClipboardEdit size={16} /><span> New Post</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className='max-w-screen-xl mx-auto p-4'>
                    <Comments comments={comments} course_id={8964} vote_history={vote_history} />
                    <ReviewPagination code={code} page_num={page_num} total_page={Math.ceil(prof_info.comments / 20)} />

                </div>
            </div>
            <ReviewReload />

        </>
    )
}

export default ReviewPage