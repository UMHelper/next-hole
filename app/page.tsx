import { DiscussionList } from "@/components/discusion"
import { getDisscussionCount, getDisscussionListByPage } from "@/lib/database/discussion"

async function HomePage() {
    const discussionCount = await getDisscussionCount()
    const discussions:any[]= await getDisscussionListByPage()
    return (
        <div className="max-w-screen-xl mx-auto p-4">
            <DiscussionList inital_discussions={discussions}/>
        {/* {discussionCount} */}
        </div>

    )
}

export default HomePage