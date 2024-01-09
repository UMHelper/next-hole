'use client'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HashEmojiAvatar } from "@/lib/utils"
import { MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"
import { getDisscussionListByPage } from "@/lib/database/discussion"

export const DiscussionListItem = ({ discussion }: { discussion: any }) => {
    console.log(discussion)
    return (
        <div className="flex space-x-1 hover:bg-gray-50 rounded p-2">
            <Avatar className="w-10 h-10">
                <AvatarFallback className="text-lg bg-blue-50">{HashEmojiAvatar({ user_id: discussion.user_id ? discussion.user_id : "anonymous" })}</AvatarFallback>
            </Avatar>
            <div className="flex justify-between w-full">
                <div>
                    <div className="">{discussion.title}</div>
                    <div className="text-xs text-gray-500">{discussion.last_posted_at.replace('T', ' ')}</div>
                </div>
                <div>
                    <div className="flex justify-center items-center space-x-1">
                        <MessageSquare size={14} strokeWidth={1.5} />
                        <span className=" text-sm text-gray-500">{discussion.comment_count}</span>
                    </div>
                </div>
            </div>
        </div>

    )

}
const LoadMore = ({ setDiscussions, discussions_lehgth }: { setDiscussions: any, discussions_lehgth: number }) => {
    const handleLoad = () => {
        getDisscussionListByPage(Math.round(discussions_lehgth / 20))
            .then((newDiscussion: any) => {
            setDiscussions((prev: any) => [...prev, ...newDiscussion])
        })
    }
    return (
        <div>
            <button className="bg-gray-100 rounded p-2 w-full" onClick={handleLoad}>Load More</button>
        </div>
    )
}

export const DiscussionList = ({ inital_discussions }: { inital_discussions: any[] }) => {
    const [discussions, setDiscussions] = useState(inital_discussions)

    useEffect(() => {
        setDiscussions(inital_discussions)
    }, [inital_discussions])

    return (
        <div className=" space-y-2">
            <div>
                {
                    inital_discussions.map((discussion, index) => {
                        return (
                            <DiscussionListItem discussion={discussion} key={index} />
                        )
                    })
                }
            </div>
            <LoadMore setDiscussions={setDiscussions} discussions_lehgth={discussions.length} />
        </div>
    )
}