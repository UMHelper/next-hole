import { redirect } from 'next/navigation'

async function HomePage() {

    redirect('/main')

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            
        </div>

    )
}

export default HomePage