'use client'
import {useEffect, useState} from "react";
import {Masonry, MasonryCol} from "@/components/masonry";
import CourseCard from "@/components/search/course_card";
import UseAnimations from "react-useanimations";
import infinity from "react-useanimations/lib/infinity"

function CourseSearchPage({params}:{params:{code:string}}){
    const [isLoading, setIsLoading]=useState(true)

    const [courseList, setCourseList]=useState([])

    useEffect(()=>{
        fetch('/api/fuzzy_search/?text=' + params.code + '&type=course')
            .then(r =>r.json())
            .then((data)=>{
                setCourseList(data['course_info'])
                setIsLoading(false)
            })
    })

    return(
        <div>
            {isLoading?(
                <div className='flex justify-center'>
                    <UseAnimations animation={infinity} size={48}/>
                </div>
            ):(
                <div>
                    <Masonry col={3} className=''>
                        {courseList.map((course,index)=>{
                            return <CourseCard data={course} key={index}/>
                        })}
                    </Masonry>
                </div>
            )}
        </div>
    )
}

export default CourseSearchPage