import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HashEmojiAvatar } from "@/lib/utils"

export const DiscussionListItem = ({ discussion }: { discussion: any }) => {
    console.log(discussion)
    return (
        <div className="flex space-x-1 hover:bg-gray-50 rounded">
            <Avatar className="w-10 h-10">
                <AvatarFallback className="text-lg">{HashEmojiAvatar({ user_id: discussion.user_id ? discussion.user_id : "anonymous" })}</AvatarFallback>
            </Avatar>
            <div>
                <div className="">{discussion.title}</div>
                <div className="text-xs text-gray-500">{discussion.last_posted_at.replace('T',' ')}</div>
            </div>
        </div>

    )

}

export const DiscussionList = ({ inital_discussions }: { inital_discussions: any[] }) => {
    return (
        <div className=" space-y-2">
            {
                inital_discussions.map((discussion, index) => {
                    return (
                        <DiscussionListItem discussion={discussion} key={index} />
                    )
                })
            }
        </div>
    )
}