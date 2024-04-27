import { delay } from "@/lib/utils";
import {NextResponse} from "next/server";
import supabase from '@/lib/database/database';
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request){
    auth().protect()

    const { userId } = auth();
    const body=await request.json();
    
    if (userId!==body.created_by) return NextResponse.json({error:"You are not authorized to vote this comment"},{status:401})
    
    const {data,error}=await supabase.from('vote').insert([{
        comment_id:body.comment,
        offset:body.offset,
        created_by:body.created_by,
        created_at:new Date().toISOString().slice(0, 19).replace('T', ' '),
        emoji:body.emoji || null
    }]).select()
    // console.log(data,error);
    return NextResponse.json(body,{status:200})
}