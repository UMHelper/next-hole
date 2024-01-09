import { DiscussionList } from "@/components/discussion"

async function HomePage() {
    return (
        <div className="max-w-screen-xl mx-auto p-4">
            <DiscussionList/>
        {/* {discussionCount} */}
        </div>

    )
}

export default HomePage