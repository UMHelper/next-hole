'use client'

import axios from "axios";
import { Card } from "./ui/card";
import { Badge } from "@/components/ui/badge"
import { Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

async function fetchBbsUpdates(count: number) {
    return axios
        .get('https://whole.umeh.top/public/api/discussions?include=user%2ClastPostedUser%2Ctags%2Ctags.parent%2CfirstPost&filter%5Btag%5D=umeh-notes&sort&page%5Boffset%5D=0')
        .then(async response => {
            if (response.data.data[0] != undefined)
                return (response.data.data.slice(0, count).map((item: any) => ({
                    'url': item.attributes.shareUrl,
                    'title': item.attributes.title,
                    'commentCount': item.attributes.commentCount,
                    'viewCount': item.attributes.viewCount,
                    'date': item.attributes.createdAt.substring(0, 10)
                })))

            else
                throw Error('No update data found in Whole.');
        })
        .catch(function (error) {
            return ([{
                'url': 'https://whole.umeh.top',
                'title': 'Cannot fetching data. Please contact us',
                'commentCount': 0,
                'viewCount': 0,
                'date': 'Error'
            }, {
                'url': 'https://whole.umeh.top',
                'title': String(error),
                'commentCount': 0,
                'viewCount': 0,
                'date': 'Message'
            }])
        });
}


export default function BbsUpdates() {
    const [data, setData] = useState([])
    useEffect(() => {
        fetchBbsUpdates(3).then((data) => {
            setData(data)
        })
    }, [])

    return (

        <div className="columns-1 border shadow rounded">
            {
                data.map((item: any) => (
                    <div key={item.url}>
                        <Link href={item.url}>
                            <div className="bg-white w-full space-y-1 mt-2 px-4 py-1">
                                <div className="flex w-full justify-between items-center" >
                                    <div className="text-sm text-slate-700">{item.date} </div>
                                    <div >
                                        <Badge className="py-0.5 px-1.5 mx-1 bg-gradient-to-r from-blue-600 to-indigo-500"><Eye size={12} className="me-1" />{item.viewCount}</Badge>
                                        <Badge className="py-0.5 px-1.5 mx-1 bg-gradient-to-r from-blue-600 to-indigo-500"><MessageCircle size={12} className="me-1" />{item.commentCount}</Badge>
                                    </div>

                                </div>
                                <div >
                                    {item.title}
                                </div>
                            </div>
                        </Link>
                        <Separator className="mt-2" />
                    </div>

                ))}
        </div>
    );
}