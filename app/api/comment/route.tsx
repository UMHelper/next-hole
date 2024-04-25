import {NextResponse} from "next/server";;
import supabase from '@/lib/database/database';
import { put } from '@vercel/blob';
import { uuid } from "@/lib/utils";

export async function POST(request: Request){
    let body = await request.formData()
    // console.log(body)
    // console.log(course)
    // delete body.code
    // delete body.prof
    let data:any={}
    data.course_id=8964
    console.log(data)
    data.result=0
    data.attendance=0
    data.pre=0
    data.grade=0
    data.hard=0
    data.reward=0
    data.assignment=0
    data.recommend=0
    data.content=body.get('content') as string
    // // 2021-10-10T16:00:00.000Z
    data.pub_time=new Date().toISOString().slice(0, 19).replace('T', ' ')
    const id:any=await supabase.from('comment').select('id').order('id',{ascending:false}).limit(1)
    
    // DO NOT CHANGE THIS ID 
    // check reply API 
    data.id=id.data[0].id+1

    // console.log(body.get('image'))
    if (body.get('verify')==="1"){
        data.verify=1
        data.verify_account=body.get('verify_account') as string
    }
    if (body.get('verify')==="1" && body.get('image')!=""){
        const image:any=(await body.get('image'))
        // const ext=image.name.split('.').pop()
        // let name=uuid()+'.'+ext
        // const blob = await put(name, await image.arrayBuffer(), {
        //     access: 'public',
        //   });

        // data.img=blob.url

        const formData = new FormData()
        formData.append('image', image)
        const response=await fetch('https://api.imgur.com/3/upload',
        {
            method: 'POST',
            body: formData,
            headers:{
                'Authorization':`Client-ID ${process.env.IMGUR_CLIENT_ID}`
            }
        })
        const json=await response.json()
        // console.log(json)
        data.img=json.data.link
        
    }
    // console.log(data)
    const {data : res,error}:{data:any, error:any}= await supabase.from('comment').insert([data]).select()
    console.log(res,error)
    const course_id=res.course_id

    return new NextResponse(null,{status:200})
}