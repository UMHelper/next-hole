'use client'
import { Drawer } from 'vaul';
import { ClipboardEdit } from 'lucide-react';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import * as z from "zod"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { SignInButton, useUser } from "@clerk/nextjs";
import { Rating, ThinStar } from '@smastrom/react-rating';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const SubmitPage = ({ params }: { params: any }) => {
    const { isSignedIn, user } = useUser();
    const [image, setImage] = useState<File | null | undefined>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formSchema = z.object({
        code: z.string().min(1).default(params.code),
        title: z.string().min(3).max(20).default(''),
        content: z.string().min(10).max(2000),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: params.code.toLowerCase(),
            content: '',
        }
    })

    useEffect(()=>{
        // console.log(form.formState.errors)
        if (Object.keys(form.formState.errors).length===0) return
        toast.error('Please fill in all required field.',
        {
            description: "請填寫所有的必填項目，並符合其要求。",
        })
    },[form.formState.errors])
    const route = useRouter()
    const submit = (values: any) => {
        // console.log(isSubmitting)
        //console.log(values)
        if (isSubmitting) {
            console.log('submitting')
            return
        }
        setIsSubmitting(true)

        let data = new FormData()
        for (const key in values) {
            data.append(key, values[key])
        }
        if (image) {
            if (!ACCEPTED_IMAGE_TYPES.includes(image.type)) {
                toast.error('Image type not supported!',
                    {
                        description: "Please upload an image in JPEG, PNG or WEBP format.",
                })
                return
            }
            if (image.size > MAX_FILE_SIZE) {
                toast.error('Image too large!',
                    {
                        description: "Please upload an image smaller than 5MB.",
                })
                return
            }
            data.append('image', image)
        }
        else {
            data.append('image', '')
        }
        if (isSignedIn) {
            data.append('verify', '1')
            data.append('verify_account', user.id)
        }
        else {
            data.append('verify', '0')
        }
        toast.promise(
            fetch(`/api/comment/${params.code}`, {
                body: data,
                method: 'POST',
            }).then((res) => {
                setIsSubmitting(false)
                route.push(`/${params.code}?reload=1`)
            }),
            {
                loading: 'Submitting...',
                success: 'Submitted!',
                error: 'Failed to submit.',
            }
        )
        
    }
    return (
            <div>
                <Form {...form}>
                {
                isSignedIn ? (
                    <FormDescription>
                        Note: The comment will be posted anonymously (logged in as {user?.firstName} {user?.lastName}).
                    </FormDescription>
                ) :
                    <FormDescription className=' text-red-400'>
                        <span>
                            You must <SignInButton mode='modal'><span className='underline hover:cursor-pointer'>sign in (click here)</span></SignInButton> to post. <br />
                            為保證內容安全，您必須 <SignInButton mode='modal'><span className='underline hover:cursor-pointer'>登入 (點擊此處)</span></SignInButton> 以發表貼文。
                        </span>

                    </FormDescription>
                    }
                    <form onSubmit={form.handleSubmit(submit)} className='md:space-y-10 space-y-4' hidden={!isSignedIn}>
                        <div className='grid-cols-1 md:grid-cols-2 md:space-x-8 hidden'>
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course Code</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className=' space-y-2'>
                            <FormItem>
                                <FormLabel>Image Upload 上載圖像 (optional)</FormLabel>
                                <FormControl>
                                    <Input type='file' onChange={
                                        (e) => {

                                            setImage(e.target.files?.[0])
                                        }
                                    }
                                        disabled={!isSignedIn}
                                    />
                                </FormControl>
                            </FormItem>

                        </div>

                        <div className=' space-y-2'>

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title 貼文標題</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Wtite post title here."
                                                className=""
                                                {...field}
                                                disabled={!isSignedIn}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                        </div>

                        <div className=' space-y-2'>

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content 內文</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write post content here."
                                                className="resize-y h-48"
                                                {...field}
                                                disabled={!isSignedIn}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            <span>
                                                You comment will be posted anonymously, but please make sure to adhere to our
                                            </span> <Link href="/" className='underline'>
                                                community guidelines
                                            </Link>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                        </div>

                        <div className=' space-y-6'>

                            <Button type="submit" className='space-x-2 bg-gradient-to-r from-violet-500 to-fuchsia-500' disabled={isSubmitting}>
                                <UploadCloud size={18} strokeWidth={2.5} />
                                <span>Submit Post</span>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
    );
};

const DrawerSubmit = ({code}:{code:string}) => {
    return (
        <Drawer.Root shouldScaleBackground>
            <Drawer.Trigger asChild>
                <Button className='text-sm px-2 hover:shadow-lg bg-white text-blue-800 hover:bg-gray-200'>
                    <ClipboardEdit size={16} /><span> 發表主題 New Post</span>
                </Button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/20"/>
                <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[80%] mt-24 fixed bottom-0 left-0 right-0 md:px-20 pt-5 px-5">
                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
                    <SubmitPage params={{code:code}}/>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}

export default DrawerSubmit