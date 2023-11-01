'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { CircleDollarSign, Microscope, Newspaper, BookMarked, Scale, School, Search, Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const formSchema = z.object({
    code: z.string()
        .min(4, {
            message: "Search Keywords must be at least 4 characters.",
        })
        .max(10, { message: 'Search Keywords must be at most 10 characters.' }),
    is_prof: z.boolean().default(false)
})

export default function Home() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            is_prof: false,
        },
    })

    const router = useRouter()

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (is_prof) {
            router.push('/search/instructor/' + values["code"].toUpperCase())
        }
        else {
            router.push('/search/course/' + values["code"].toUpperCase())
        }

    }

    const [is_prof, set_is_prof] = useState(false)

    return (
        <>
            <div className='bg-gradient-to-r to-blue-600 from-indigo-600'>
                <div className='max-w-screen-xl mx-auto p-4'>
                    <div className='flex justify-between mx-8 py-8 '>
                        <div className='md:flex flex-col justify-center text-white hidden space-y-2'>
                            <div className='text-4xl'>
                                澳大选咩课
                            </div>
                            <div className='text-3xl'>
                                What2REG @UM
                            </div>
                            <div className='text-base'>
                                專為澳大學生而設的課程評價網站
                            </div>
                            <div className='text-base'>
                                Course review platform for University of Macau
                            </div>
                        </div>
                        <Card className="md:mx-8 md:w-96 w-full mx-0">
                            <CardHeader>

                            </CardHeader>
                            <CardContent className='space-y-2'>
                                <div>
                                    <CardTitle >{is_prof ? '搜尋讲师' : '搜尋課程'}</CardTitle>
                                    <CardDescription >{is_prof ? 'Find Instructors' : 'Find Courses'}</CardDescription>
                                </div>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="code"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder={is_prof ? "e.g., CHAN Tai Man" : "e.g., ACCT1000 or Accounting"} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="is_prof"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 mb-1">
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={(e) => {
                                                                field.onChange(e)
                                                                set_is_prof(!is_prof)
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <div className='my-0 flex items-center space-x-2'>
                                                        <div>
                                                            <FormLabel className="text-base">
                                                                搜索讲师
                                                            </FormLabel>
                                                            <FormDescription >
                                                                Search Instructors
                                                            </FormDescription>
                                                        </div>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className='bg-gradient-to-r from-purple-400 to-rose-500'>
                                            <Search size={20} />
                                            Search
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                            <CardFooter className='text-xs text-gray-400 flex flex-col items-start'>
                                <div>輸入部分課程代碼/名稱或講師姓名</div>
                                <div className='max-w-sm'>Search by course codes/titles, or name of instructors (partial search supported)</div>
                                <div className='italic'>Data Source: reg.um.edu.mo</div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-violet-500">
                <div className="max-w-screen-xl mx-auto p-4">
                    <div className="mx-8 py-8">
                        <div className="text-white text-center text-2xl mb-4">
                            Live Statistics
                        </div>        
                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <Table className="bg-white rounded">
                                <TableCaption className="bg-white m-0 pb-4 rounded-b">Most popular course</TableCaption>
                                <TableBody className="text-center">
                                    <TableRow>
                                    <TableCell>ACCT1000</TableCell>
                                    </TableRow>
                                    <TableRow>
                                    <TableCell>CISC2005</TableCell>
                                    </TableRow>
                                    <TableRow>
                                    <TableCell>EELC1003</TableCell>
                                    </TableRow>
                                    <TableRow>
                                    <TableCell>GESB1002</TableCell>
                                    </TableRow>
                                    <TableRow>
                                    <TableCell>CISC1001</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Table className="bg-white rounded">
                                <TableCaption className="bg-white m-0 pb-4 rounded-b">Most popular instructor</TableCaption>
                                <TableBody className="text-center">
                                    <TableRow>
                                    <TableCell>ACCT1000</TableCell><TableCell> CHAN WENG HANG</TableCell>
                                    </TableRow>
                                    <TableRow>
                                    <TableCell>CISC2005</TableCell><TableCell> TCHIANG VAN KAM</TableCell>
                                    </TableRow>
                                    <TableRow>
                                    <TableCell>EELC1003 </TableCell><TableCell> CARLOS NORONHA</TableCell>
                                    </TableRow>
                                    <TableRow>
                                    <TableCell>GESB1002 </TableCell><TableCell> PUN SAU TAK</TableCell>
                                    </TableRow>
                                    <TableRow>
                                    <TableCell>CISC1001</TableCell><TableCell> TERESA CHU</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>


                        </div>                          
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-500">
                <div className="max-w-screen-xl mx-auto p-4">
                    <div className="mx-8 py-8">
                        <div className="text-white text-center text-2xl">
                            Comment Bank
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-7 text-white mt-8">
                            <div className="flex flex-col items-center">
                                <Newspaper size={80} strokeWidth={1} />
                                <div className="text-lg">
                                FAH
                                </div>
                                <div className="text-sm">
                                65 courses
                                </div>
                                <div className="text-sm">
                                472 comments
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <CircleDollarSign size={80} strokeWidth={1} />
                                <div className="text-lg">
                                FBA
                                </div>
                                <div className="text-sm">
                                65 courses
                                </div>
                                <div className="text-sm">
                                472 comments
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <School size={80} strokeWidth={1} />
                                <div className="text-lg">
                                FED
                                </div>
                                <div className="text-sm">
                                65 courses
                                </div>
                                <div className="text-sm">
                                472 comments
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <Microscope size={80} strokeWidth={1} />
                                <div className="text-lg">
                                FHS
                                </div>
                                <div className="text-sm">
                                65 courses
                                </div>
                                <div className="text-sm">
                                472 comments
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <Scale size={80} strokeWidth={1} />
                                <div className="text-lg">
                                FLL
                                </div>
                                <div className="text-sm">
                                65 courses
                                </div>
                                <div className="text-sm">
                                472 comments
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <BookMarked size={80} strokeWidth={1} />
                                <div className="text-lg">
                                FSS
                                </div>
                                <div className="text-sm">
                                65 courses
                                </div>
                                <div className="text-sm">
                                472 comments
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <Bot size={80} strokeWidth={1} />
                                <div className="text-lg">
                                FST
                                </div>
                                <div className="text-sm">
                                65 courses
                                </div>
                                <div className="text-sm">
                                472 comments
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
