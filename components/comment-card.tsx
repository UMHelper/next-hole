'use client'
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn, get_bg, get_gpa } from '@/lib/utils'
import { Angry, BadgeCheck, Flag, SmilePlus, ThumbsDown, ThumbsUp, MessageSquare, Reply } from 'lucide-react'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Rating, ThinStar } from "@smastrom/react-rating";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

Fancybox.bind("[data-fancybox]", {
    compact: true,
    contentClick: 'close',
    contentDblClick: 'close',
});
const ReplyCard = ({ reply }: { reply: any }) => {
    return (
        <div className=" space-y-1 ">
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger className="inline-flex">
                        <span className='text-gray-400 text-xs'>
                            {/* convert 2022-10-20T03:44:32.219061 to 2022-10-20 */}
                            {reply.pub_time.split('T')[0]}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className='text-xs text-gray-400'>#{
                            reply.id
                        }</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className='text-sm break-all'>
                {reply.content}
            </div>
            <EmojiVote comment={reply} />
        </div>
    )

}
const ReplySubmit = ({ comment, onSubmit }: { comment: any, onSubmit: any }) => {
    const { isSignedIn, user } = useUser();

    const [reply, setReply] = useState<string>("")
    if (!isSignedIn) {
        return (
            <div>
                <div className='text-gray-400 text-xs'>
                    Please login to reply
                </div>
            </div>
        )
    }

    return (
        <div className=" space-y-1">
            <div className=" space-y-1">
                <Textarea
                    placeholder="Reply this review"
                    onChange={(e) => {
                        setReply(e.target.value)
                    }}
                    value={reply}
                    className=" focus-visible:ring-0 resize-none w-full h-20"
                />
                <div className="flex items-end space-x-1">
                    <Button variant="outline" className="w-full" size='xs' onClick={() => {
                        const t_reply = reply
                        setReply("")
                        onSubmit(t_reply)
                    }}>Reply</Button>
                    {/* <div className='text-gray-400 text-xs'>
                        as <span className=" text-blue-500">{user?.fullName}</span>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
const ReplyComponent = ({ comment, reply_comment }: { comment: any, reply_comment: any[] }) => {
    const pathname = usePathname()
    const { isSignedIn, user } = useUser();

    const [currentReply, setCurrentReply] = useState<any[]>(reply_comment)

    const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false)
    const [isReplySubmitOpen, setIsReplySubmitOpen] = useState<boolean>(false)

    const openReplySubmition = () => {
        if (!isSignedIn) {
            toast(
                (
                    <div className="flex justify-between w-full items-center">
                        <div>
                            <div>You must sign in to reply!</div>
                            <div className='text-xs text-gray-400'>您必須登入以回覆。</div>
                        </div>
                        <div className='py-1 px-2 ml-2 rounded bg-gradient-to-r from-blue-600 to-indigo-500 text-white'>
                            <SignInButton mode="modal" redirectUrl={pathname} />
                        </div>
                    </div>
                )
            )
            return
        }
        setIsReplySubmitOpen(!isReplySubmitOpen)
    }

    const submitReply = (reply: any) => {
        let body = { ...comment }
        body.content = reply
        body.replyto = comment.id
        body.verify = 1
        body.verify_account = user?.id
        body.pub_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
        toast.promise(
            fetch(`/api/reply/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...body
                })
            }).then(res => res.json()).then(res => {
                // console.log(res)
                setCurrentReply((pre: any[]) => [res, ...pre])
                setIsReplySubmitOpen(false)
                setIsReplyOpen(true)
            }),
            {
                loading: 'Submiting...',
                success: 'Thanks for your reply!',
                error: 'Error',
            }
        )
    }

    if (currentReply.length === 0) {
        return (
            <div>
                <div className="flex justify-between">
                    <div className=" text-xs text-gray-400 flex space-x-1 items-center">
                        <MessageSquare size={12} strokeWidth={2.5} />
                        <div>
                            No Reply
                        </div>
                    </div>

                    <div
                        onClick={openReplySubmition}
                        className={cn(" text-xs hover:text-blue-500 hover:cursor-pointer flex space-x-1 items-center",
                            isReplySubmitOpen ? 'text-blue-500' : ' text-gray-800')}
                    >
                        <Reply size={14} strokeWidth={2.5} />
                        <div>
                            Reply
                        </div>
                    </div>
                </div>
                <div className={cn(!isReplySubmitOpen ? 'hidden' : "", 'pt-1')}>
                    <ReplySubmit comment={comment} onSubmit={submitReply} />
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between">
                <div onClick={() => {
                    setIsReplyOpen(!isReplyOpen)
                }}
                    className={cn(" text-xs hover:text-blue-500 hover:cursor-pointer flex space-x-1 items-center",
                        isReplyOpen ? 'text-blue-500' : ' text-gray-800')}
                >
                    <MessageSquare size={12} strokeWidth={2.5} />
                    <div>
                        {`${currentReply.length} ${currentReply.length === 1 ? "Reply" : "Replies"}`}
                    </div>
                </div>
                <div
                    onClick={openReplySubmition}
                    className={cn(" text-xs hover:text-blue-500 hover:cursor-pointer flex space-x-1 items-center",
                        isReplySubmitOpen ? 'text-blue-500' : ' text-gray-800')}
                >
                    <Reply size={14} strokeWidth={2.5} />
                    <div>
                        Reply
                    </div>
                </div>
            </div>
            <div className={cn(!isReplySubmitOpen ? 'hidden' : "", 'pt-1')}>
                <ReplySubmit comment={comment} onSubmit={submitReply} />
            </div>
            <div className={cn(!isReplyOpen ? 'hidden' : "")}>
                <div className=" space-y-2 pt-2">
                    {currentReply.map((reply, index) => {
                        return (
                            <div key={index} className=" space-y-1">
                                <ReplyCard reply={reply} />
                                {
                                    index != currentReply.length - 1 ? (
                                        <Separator className='my-2' decorative />
                                    ) : null
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

    )
}

const CommentDetail = ({ comment, env }: { comment: any, env: string }) => {
    return (
        <div className='flex flex-col justify-between'>
            <p className='break-words'>
                {comment.content}
            </p>
            {
                comment.img ? (
                    env != 'review' ? (
                        <div className='w-fit my-2' style={{
                            maxWidth: '50vw',
                        }}>
                            <img
                                alt={comment.content}
                                src={comment.img}
                                className='rounded'
                            />
                        </div >
                    ) : (
                        <div className='w-fit my-2'>
                            <a href={comment.img} data-fancybox={comment.img} data-caption={comment.content + env}>
                                <img
                                    alt={comment.content}
                                    src={comment.img}
                                    className='rounded'
                                />
                            </a>
                        </div >
                    )
                ) : null
            }
        </div >
    )
}

const EmojiVote = ({ comment }: { comment: any }) => {
    const pathname = usePathname()

    const { isSignedIn, user, isLoaded } = useUser();

    const [voteHistory, setVoteHistory] = useState<any>(null)
    const [emojiHistory, setEmojiHistory] = useState<any>([])

    useEffect(() => {
        const voteHistory = comment.vote_history.filter((vote: any) => vote.created_by == user?.id && vote.offset != 0)
        if (voteHistory.length > 0) {
            // console.log(voteHistory[0])
            setVoteHistory(voteHistory[0])
        }
        if (!isSignedIn) {
            setEmojiHistory([])
            return
        }
        const emojiHistory = comment.vote_history.filter((vote: any) => vote.created_by == user?.id && vote.offset == 0)
        if (emojiHistory.length > 0) {
            // console.log(emojiHistory)
            setEmojiHistory(emojiHistory)
        }
    }, [user, comment, isSignedIn])
    const [isVoting, setIsVoting] = useState<boolean>(false)
    const handleVote = (offset: number, emoji?: string) => {
        if (!isSignedIn) {
            toast(
                (
                    <div className="flex justify-between w-full items-center">
                        <div>
                            <div>You must sign in to vote!</div>
                            <div className='text-xs text-gray-400'>您必須登入以投票。</div>
                        </div>
                        <div className='py-1 px-2 ml-2 rounded bg-gradient-to-r from-blue-600 to-indigo-500 text-white'>
                            <SignInButton mode="modal" redirectUrl={pathname} />
                        </div>
                    </div>
                )
            )
            return
        }
        if (isVoting) {
            return
        }
        setIsVoting(true)
        if (voteHistory != null && offset != 0) {
            toast.error("You have already voted!",
                {
                    description: "您已經投票過",
                })
            return
        }
        if (offset == 0) {
            if (emojiHistory.filter((emojiH: any) => emojiH.emoji === emoji).length > 0) {
                toast.error("You have already voted for " + emoji + "!",
                    {
                        description: "您已經投票過 " + emoji,
                    })
                return
            }
        }
        toast.promise(
            fetch(`/api/vote/${comment.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    comment: comment.id,
                    offset: offset,
                    created_by: user?.id,
                    emoji: emoji
                })
            }).then(res => res.json()).then(res => {
                // console.log(res)
                if (offset != 0) {
                    setVoteHistory(res)
                    if (offset === 1) {
                        comment.upvote += res.offset
                    }
                    else {
                        comment.downvote += res.offset
                    }
                }
                else {
                    setEmojiHistory((pre: any[]) => [...pre, res])
                    comment.emoji_vote.map((emoji: any) => {
                        if (emoji.emoji == res.emoji) {
                            emoji.count += 1
                        }
                    })
                }
                setIsVoting(false)
            }),
            {
                loading: 'Voting...',
                success: 'Thanks for your vote!',
                error: 'Error',
            }
        )

    }
    return (
        <div className="flex flex-wrap justify-start pt-1 items-center  text-xs pb-1">
            {comment.emoji_vote.map((emoji: any, index: number) => {
                if (emoji.count == 0) {
                    return null
                }
                return (
                    <div
                        className={cn('flex items-center me-2 mb-1 space-x-1 px-2 rounded-full',
                            emojiHistory.filter((emojiH: any) => emojiH.emoji === emoji.emoji).length > 0 ?
                                'bg-sky-100 text-sky-600  border-sky-600 border hover:bg-blue-200' :
                                'bg-white text-gray-800 border-gray-300 border hover:bg-gray-200'
                        )}
                        onClick={() => handleVote(0, emoji.emoji)}
                        key={index}
                    >
                        <div className='text-sm'>
                            {emoji.emoji}
                        </div>
                        <div className='text-xs'>
                            {emoji.count}
                        </div>
                    </div>
                )
            })}
            {
                comment.emoji_vote.filter((emoji: any) => emoji.count === 0).length > 0 ? (

                    <Popover>
                        <PopoverTrigger>
                            <div className='flex items-center me-2 mb-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800 border-gray-300 border hover:bg-gray-300'>
                                <SmilePlus size={12} strokeWidth={2.5} />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className=" w-fit">
                            <div className="flex space-x-2 text-sm">
                                {comment.emoji_vote.map((emoji: any, index: number) => {
                                    if (emoji.count != 0) {
                                        return null
                                    }
                                    return (
                                        <div
                                            className={cn('flex items-center px-2 py-1 rounded-full',
                                                emojiHistory.filter((emojiH: any) =>
                                                    emojiH.emoji === emoji.emoji).length > 0 ?
                                                    'bg-sky-100 text-sky-600  border-sky-600 border hover:bg-blue-200' :
                                                    'bg-white text-gray-800 border-gray-300 border hover:bg-gray-200'
                                            )}
                                            onClick={() => handleVote(0, emoji.emoji)}
                                            key={index}
                                        >
                                            <div className='text-base'>
                                                {emoji.emoji}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </PopoverContent>
                    </Popover>

                ) : null
            }
        </div>
    )
}
export const CommentCard = (
    { comment, reply_comment }: { comment: any, reply_comment: any[] }
) => {
    return (
        <Card className=' hover:shadow-lg mx-auto'>
            <CardHeader className='pb-2 pt-4'  >
                <div className='flex justify-between'>
                    <Popover>
                        <PopoverTrigger >
                            <Rating
                                style={{ width: 100 }}
                                value={comment.recommend}
                                itemStyles={{
                                    itemShapes: ThinStar,
                                    activeBoxColor: ['#e7040f', '#ff6300', '#ffde37', '#61bb00', '#19a974'],
                                    inactiveBoxColor: '#C7C7C7',
                                    inactiveFillColor: 'white',
                                    activeFillColor: 'white',
                                }}
                                spaceBetween="small"
                                halfFillMode="box"
                                readOnly
                            />
                        </PopoverTrigger>
                        <PopoverContent className="w-48">
                            <div className='grid grid-cols-3 gap-4 text-xs '>
                                <div className='text-gray-400 col-span-2 '>
                                    <div >
                                        Recommend:
                                    </div>
                                    <div >
                                        Grade:
                                    </div>
                                    <div >
                                        Workload:
                                    </div>
                                    <div>
                                        Difficulty:
                                    </div>
                                    <div>
                                        Usefulness:
                                    </div>
                                </div>

                                <div>
                                    <div className={cn(get_bg(comment.recommend), 'bg-clip-text text-transparent')}>
                                        {get_gpa(comment.recommend)}
                                    </div>
                                    <div className={cn(get_bg(comment.grade), 'bg-clip-text text-transparent')}>
                                        {get_gpa(comment.grade)}
                                    </div>
                                    <div className={cn(get_bg(comment.assignment), 'bg-clip-text text-transparent')}>
                                        {get_gpa(comment.assignment)}
                                    </div>
                                    <div className={cn(get_bg(comment.hard), 'bg-clip-text text-transparent')}>
                                        {get_gpa(comment.hard)}
                                    </div>
                                    <div className={cn(get_bg(comment.reward), 'bg-clip-text text-transparent')}>
                                        {get_gpa(comment.reward)}
                                    </div>
                                </div>


                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* if comment.isCurrentUserVoted  show badge*/}
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger className="inline-flex">

                                <span className='text-gray-400 text-xs'>
                                    {/* convert 2022-10-20T03:44:32.219061 to 2022-10-20 */}
                                    {comment.pub_time.split('T')[0]}
                                </span>
                                <span className={
                                    comment.verify === 1 ?
                                        'text-green-600 text-xs flex mx-2' :
                                        'hidden'
                                }>
                                    <BadgeCheck size={16} strokeWidth={1.75} absoluteStrokeWidth />

                                    {/*<div className='px-1 italic'>
                                        Verified
                                    </div>*/}
                                </span>

                            </TooltipTrigger>
                            <TooltipContent>
                                <p className='text-xs text-gray-400'>Comment #{
                                    comment.id
                                }</p>
                                <p className='text-xs'>{
                                    comment.verify === 1 ?
                                        'Verified user (logged in)' :
                                        'Not verified'
                                }</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent>
                <CommentDetail comment={comment} env={'review'} />
                <Separator className='my-2' />
                <EmojiVote comment={comment} />
                <ReplyComponent comment={comment} reply_comment={reply_comment} />

            </CardContent>
        </Card>
    )
}