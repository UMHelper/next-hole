import { Masonry } from "@/components/masonry"
import { CommentCard } from "@/components/comment_card"
import Link from "next/link"

const Comments = ({ comments, course_id }: { comments: any[], course_id: string }) => {
    const non_reply_comments = comments.filter((comment) => comment.replyto === null)

    const reply_comment = comments.filter((comment) => comment.replyto !== null)
    return (
        <>
            <Masonry col={3} className="">
                {non_reply_comments.map((comment: any, index: number) => {
                    return (
                        <div key={index}>
                            <CommentCard
                                comment={comment}
                                reply_comment={
                                    reply_comment.filter(
                                        (reply: any) => {
                                            return reply.replyto == comment.id
                                        }
                                    )
                                }
                            />
                        </div>
                    )
                })}
            </Masonry>
            {non_reply_comments.length == 0 ? (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent text-xl font-black mt-4">
                    No comment yet. <br/>
                    Ask your questions at <Link className="self-center text-2xl font-bold font-black whitespace-nowrap bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent" href="https://whole.umeh.top/public/t/adddrop">WHOLE</Link> student community, and be the first one to comment!
                </div>
            ) : null}
        </>
    )
}

export { Comments }
