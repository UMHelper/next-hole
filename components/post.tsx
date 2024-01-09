import { HashEmojiAvatar, cn } from "@/lib/utils";
import { SignInButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SmilePlus } from "lucide-react";

export const EmojiVote = ({ post }: { post: any }) => {
    const pathname = usePathname()

    const { isSignedIn, user, isLoaded } = useUser();
    const [emojiHistory, setEmojiHistory] = useState<any>(post.vote_history.filter((vote: any) => vote.created_by == user?.id))

    const [isVoting, setIsVoting] = useState<boolean>(false)
    const handleVote = (emoji: string) => {
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
        if (emojiHistory.filter((emojiH: any) => emojiH.emoji === emoji).length > 0) {
            toast.error("You have already voted for " + emoji + "!",
                {
                    description: "您已經投票過 " + emoji,
                })
            return
        }

        toast.promise(
            fetch(`/api/vote/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post: post.id,
                    offset: emoji,
                    created_by: user?.id,
                })
            }).then(res => res.json()).then(res => {
                setEmojiHistory((pre: any[]) => [...pre, res])
                post.vote_statics.map((emoji: any) => {
                    if (emoji.emoji == res.emoji) {
                        emoji.count += 1
                    }
                })
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
        <div className="flex flex-wrap justify-start my-2 items-center text-xs">
            {post.vote_statics.map((emoji: any, index: number) => {
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
                        onClick={() => handleVote(emoji.emoji)}
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
                post.vote_statics.filter((emoji: any) => emoji.count === 0).length > 0 ? (

                    <Popover>
                        <PopoverTrigger>
                            <div className='flex items-center me-2 mb-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800 border-gray-300 border hover:bg-gray-300'>
                                <SmilePlus size={12} strokeWidth={2.5} />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className=" w-fit">
                            <div className="flex space-x-2 text-sm">
                                {post.vote_statics.map((emoji: any, index: number) => {
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
                                            onClick={() => handleVote(emoji.emoji)}
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