'use client'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HashEmojiAvatar, cn, removeTags } from "@/lib/utils"
import { ChevronsDown, MessageSquare, Reply } from "lucide-react"
import { useEffect, useState } from "react"
import { getDisscussionListByPage } from "@/lib/database/discussion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { getPostById } from "@/lib/database/post"
import { EmojiVote } from "@/components/post"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SignInButton, useUser } from "@clerk/nextjs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import useSWRInfinite from 'swr/infinite'
import { Masonry } from "@/components/masonry"
import useInfiniteScroll from 'react-infinite-scroll-hook';

const ReplyCard = ({ reply }: { reply: any }) => {
    return (
        <div className="flex ">

            <Avatar className="w-8 h-8">
                <AvatarFallback className="text-sm">{reply.user_id}</AvatarFallback>
            </Avatar>
            <div className="ms-2 min-w-0">
                <Popover>
                    <PopoverTrigger className="inline-flex">
                        <span className='text-gray-400 text-xs'>
                            {/* convert 2022-10-20T03:44:32.219061 to 2022-10-20 */}
                            {reply.created_at.split('T')[0]}
                        </span>
                    </PopoverTrigger>
                    <PopoverContent side="right" className=" w-fit">
                        <p className='text-xs text-gray-400'>Reply #{
                            reply.id
                        }</p>
                    </PopoverContent>
                </Popover>
                <div className='text-sm break-words'>
                    {removeTags(reply.content)}
                </div>
                <EmojiVote post={reply} />
            </div>
        </div>
    )

}

const ReplySubmit = ({ onSubmit }: { onSubmit: any }) => {
    const { isSignedIn, user } = useUser();

    const [reply, setReply] = useState<string>("")
    if (!isSignedIn) {
        return (
            <div>
                <div className='text-gray-400 text-xs'>
                    You must sign in to reply!
                </div>
            </div>
        )
    }

    return (
        <div className="my-2 space-y-1">
            <div className=" space-y-1">
                <Textarea
                    placeholder={"Reply to this review. You will reply as " + HashEmojiAvatar({ user_id: user?.id })}
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
const ReplyComponent = ({ discussion, reply }: { discussion: any, reply: any[] }) => {
    const pathname = usePathname()
    const { isSignedIn, user } = useUser();

    const [currentReply, setCurrentReply] = useState<any[]>(reply)

    const [isReplyOpen, setIsReplyOpen] = useState<boolean>(reply.length <= 3 && reply.length > 0)
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

    const openReply = () => {
        if (!isSignedIn) {
            toast(
                (
                    <div className="flex justify-between w-full items-center">
                        <div>
                            <div>You must sign in to view all replies!</div>
                            <div className='text-xs text-gray-400'>您必須登入以瀏覽全部回覆。</div>
                        </div>
                        <div className='py-1 px-2 ml-2 rounded bg-gradient-to-r from-blue-600 to-indigo-500 text-white'>
                            <SignInButton mode="modal" redirectUrl={pathname} />
                        </div>
                    </div>
                )
            )
            return
        }
        setIsReplyOpen(!isReplyOpen)
    }

    const submitReply = (reply: any) => {
        let body = { ...discussion }

        if (reply.length < 5 || reply.length > 250) {
            toast.error('Reply too short or too long! No spam allowed. ',
                {
                    description: "回覆太短或太長！禁止無意義垃圾回復。",
                })
            return
        }
        body.content = reply
        body.replyto = discussion.id
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
                document.getElementById(`reply${discussion.id}`)?.scrollTo({ top: 0 })
            }),
            {
                loading: 'Submiting...',
                success: 'Thanks for your reply!',
                error: 'Error',
            }
        )
    }
    useEffect(() => {
        document.getElementById(`reply${discussion.id}`)?.scrollTo({ top: 0 })
    }, [discussion])

    return (
        <div>
            <div className="flex justify-between mt-3 mb-2 pl-1">
                <div onClick={() => {
                    openReply()
                    document.getElementById(`reply${discussion.id}`)?.scrollTo({ top: 0 })

                }}
                    className={cn(" text-xs hover:text-blue-500 hover:cursor-pointer flex space-x-1 items-center",
                        isReplyOpen ? 'text-blue-500' : ' text-gray-800')}
                >
                    <MessageSquare size={12} strokeWidth={2.5} />
                    <div>
                        {`${currentReply.length === 0 ? "No " : currentReply.length} ${currentReply.length === 1 ? "Reply" : "Replies"}`}
                        {currentReply.length > 2 && isReplyOpen ? " (hide)" : ""}
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
            <div className={cn(!isReplySubmitOpen ? 'hidden' : "", 'pl-1')}>
                <ReplySubmit onSubmit={submitReply} />
            </div>

            {currentReply.length > 0 ?
                <div id={`reply${discussion.id}`} className={cn(!isReplyOpen ? 'max-h-[150px] overflow-y-hidden ' : "max-h-[600px] overflow-y-auto", '-py-1')}>
                    <div className=" space-y-2 py-2 pe-3">
                        {currentReply.map((reply, index) => {
                            return (
                                <div key={index} className=" space-y-1">
                                    <ReplyCard reply={reply} />
                                </div>
                            )
                        })}
                    </div>
                </div> : null}

            {currentReply.length > 0 ?
                <div className={cn(!isReplyOpen ? 'block ' : "hidden")}>
                    <div onClick={() => {
                        openReply()
                        document.getElementById(`reply${discussion.id}`)?.scrollTo({ top: 0 })
                    }}
                        className={cn("py-2 place-content-center text-xs hover:text-blue-500 hover:cursor-pointer flex space-x-1 items-center text-blue-500")}
                    >
                        <ChevronsDown size={12} strokeWidth={2.5} />
                        <div>
                            View more
                        </div>
                    </div>
                </div> : null}

        </div>

    )
}

export const DiscussionListItem = ({ discussion }: { discussion: any }) => {
    return (
        <Card className=' hover:shadow-lg mx-auto'>
            <CardHeader className='py-2'  >
                <div className='flex space-x-2 items-center'>
                    <div>
                        <Avatar className="w-10 h-10">
                            <AvatarFallback className="text-lg bg-blue-50">{discussion.user_id}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className=" font-semibold">{discussion.title}</div>
                </div>
            </CardHeader>
            <CardContent className='pb-1'>
                <div>
                    {discussion.first_post ? removeTags(discussion.first_post.content) : ""}
                </div>
                <EmojiVote post={discussion.first_post} />
            </CardContent>
            {//<Separator className='my-2' />
            }
            <CardFooter className='block bg-gray-50 py-1 pl-5'>
                <ReplyComponent discussion={discussion} reply={discussion.reply_post} />
            </CardFooter>
        </Card>

    )

}
export const DisscussionListPage = ({ discussionList }: { discussionList: any[] }) => {
    return (
        <>
            {
                discussionList.length > 0 ? discussionList.map((discussion, index) => {
                    return (
                        <DiscussionListItem discussion={discussion} key={index} />
                    )
                }) : null
            }
        </>
    )
}

export const DiscussionList = () => {
    const getKey = (pageIndex: any, previousPageData: any) => {
        if (previousPageData && !previousPageData.length) return null // reached the end
        return `/api/discussion/more_discussions?page=${pageIndex}`
    }
    const { data: discussionsPage, isValidating, setSize, size } = useSWRInfinite(getKey, (url) => fetch(url).then(res => res.json().then(res => res.data)), { revalidateFirstPage: false })

    const [sentryRef] = useInfiniteScroll({
        loading:isValidating,
        hasNextPage: true,
        onLoadMore: ()=>{setSize(size+1)},
      });
      
    useEffect(() => {
        console.log(isValidating)
    }, [isValidating])
    if (discussionsPage === undefined) {
        return (
            <div>
                Loading
            </div>
        )
    }
    return (
        <>
            <Masonry col={3} className="">
                {
                    discussionsPage.flat().map((discussion, index) => {
                        return (
                            <DiscussionListItem discussion={discussion} key={index} />
                        )
                    })
                }
            </Masonry>
            <div className="pt-2" ref={sentryRef}>
                <button
                    className="bg-gray-100 rounded p-2 w-full"
                    onClick={() => {
                        setSize(size + 1)
                    }}
                    disabled={isValidating}>{isValidating ? "Loading..." : 'Load More'}</button>
            </div>
        </>
    )
}