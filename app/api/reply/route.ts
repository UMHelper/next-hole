import { getPostById } from "@/lib/database/post"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const id = url.searchParams.get('discussion_id')
    if (id === null) {
        return new Response(JSON.stringify({ code: 0 }))
    }
    const data = await getPostById(parseInt(id))
    return new Response(JSON.stringify({
        data: data,
        code: 1
    }))
}
