import Toolbar from "@/components/toolbar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CalendarRange, ChevronRightCircle, ClipboardEdit, Divide } from "lucide-react";
import { Masonry } from "@/components/masonry";
import { CommentCard } from "@/components/comment_card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimetableCard } from "@/components/timetable-card";
import { getCommentList } from "@/lib/database/comment-list";
import { getProfInfo } from "@/lib/database/prof-info";
import { fuzzySearch } from "@/lib/database/fuzzy-search";
import Link from "next/link";

import { COMMENT } from "@/consant";
import { getCourseInfo } from "@/lib/database/course-info";

export function generateMetadata(
    {params}:{params:any}) {
    const title = `${params.prof.join('/').replaceAll('%20'," ")} | ${params.code} | What2Reg @ UM 澳大選咩課 @UM`

    return {
        title: title,
    }

}

async function fetchData(code:string,prof:string) {
    const timetable=COMMENT['prof_info']['offer_info']['schedules'];
    const comment= await getCommentList(code,prof.replaceAll('$','/'));
    const prof_info=await getProfInfo(code,prof.replaceAll('$','/'));
    
    const is_offered=prof_info['is_offered'];
    const course_info=await getCourseInfo(code);
    //(await fuzzySearch(code,'course'))[0];


    return {
        timetable,
        comment,
        prof_info,
        is_offered,
        course_info,
    }
}

const ReviewPage = async ({ params }: { params: { code: string, prof: string[] } }) => {
    const {
        timetable,
        comment,
        prof_info,
        is_offered,
        course_info,
    } = await fetchData(params.code, params.prof.join('/'));

    return (
        <>
            <div className='bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-6'>
                <div className='max-w-screen-xl mx-auto p-4'>

                    <div className='flex flex-col md:flex-row justify-between'>
                        <div className="py-3">
                            <div>
                                <Link href={"/search/course/" + course_info['New_code'].substring(0, 4)} className="flex space-x-1 items-center">
                                    <div className='text-sm'>{course_info['New_code'].substring(0, 4)}</div>
                                    <ChevronRightCircle size={14} strokeWidth={1.5} />
                                </Link>
                            </div>
                            <div className='font-bold text-xl'>
                                <Link href={"/course/" + course_info['New_code']} className="flex space-x-1 items-center">
                                    <h2>
                                        {course_info['New_code']}
                                    </h2>
                                    <ChevronRightCircle size={14} strokeWidth={1.5} />
                                </Link>
                            </div>
                            <div className='text-base'>{course_info["courseTitleEng"]}</div>
                            <div className='text-sm'>{course_info["courseTitleChi"]}</div>
                            <div className='pb-3 flex-row flex space-x-2 mt-4'>
                                <Link className="flex space-x-2" href={'/search/instructor/' + prof_info.prof_id}>
                                    <h1 className='font-bold text-3xl'>{prof_info['prof_id']}</h1>
                                    <ChevronRightCircle size={16} strokeWidth={1.5} />
                                    </Link>
                                    {(
                                        is_offered?
                                            <div className='text-sm font-semibold rounded-3xl bg-gradient-to-r from-green-600 to-green-600 h-fit py-0.5 px-2 shadow'> Offered</div>
                                            :
                                            <div className='text-sm font-semibold rounded-3xl bg-gradient-to-r from-neutral-700 to-stone-900 h-fit py-0.5 px-2 shadow'> Not Offered</div>
                                    )}
                                </div>
                                <div className='flex-row flex space-x-2'>
                                    <Link href={'/submit/'+params.code+'/'+params.prof}>
                                        <Button className='text-sm px-2 hover:shadow-lg bg-white text-blue-800 hover:bg-gray-200'>
                                            <ClipboardEdit size={16}/><span> Submit Review</span>
                                        </Button>
                                    </Link>
                                    
                                    {
                                        is_offered?
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button className='text-sm px-2 hover:shadow-lg  bg-white text-blue-800 hover:bg-gray-200' disabled>
                                                    <CalendarRange size={16} /> <span>Timetable (IP)</span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <TimetableCard timetable={timetable} />
                                            </PopoverContent>
                                        </Popover>
                                        :
                                        <></>
                                }
                            </div>
                            <Toolbar course={course_info} prof={undefined} />
                        </div>
                        <Card className='md:w-80 py-4 pb-0 md:m-0 mt-8'>
                            <CardContent className="h-full py-4">
                                <div className='space-y-2 flex flex-col h-full justify-between'>
                                    <div className='space-y-2 text-sm'>
                                        <div>
                                            總體 Overall
                                        </div>
                                        <Progress value={prof_info['result'] * 20} className='h-2' />
                                    </div>
                                    <div className='space-y-2 text-sm'>
                                        <div>
                                            成績 Grade
                                        </div>
                                        <Progress value={prof_info['grade'] * 20} className='h-2' />
                                    </div>
                                    <div className='space-y-2 text-sm'>
                                        <div>
                                            難度 Difficulty
                                        </div>
                                        <Progress value={prof_info['hard'] * 20} className='h-2' />
                                    </div>
                                    <div className='space-y-2 text-sm'>
                                        <div>
                                            收穫 Outcome
                                        </div>
                                        <Progress value={prof_info['reward'] * 20} className='h-2' />
                                    </div>
                                    <p className='text-xs italic text-gray-500'>Based on the reviews from users.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>


                </div>
            </div>

            <div>
                <div className='max-w-screen-xl mx-auto p-4'>
                    <Masonry col={3} className="">
                        {comment.map((comment: any, index: number) => {
                            return (
                                <div key={index}>
                                    <CommentCard comment={comment} prof={prof_info} course={course_info} />
                                </div>
                            )
                        })}
                    </Masonry>
                </div>
            </div>
        </>
    )
}

export default ReviewPage