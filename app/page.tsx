import { redirect } from 'next/navigation'

async function HomePage() {

    redirect('/public')

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            
        </div>

    )
}

export default HomePage