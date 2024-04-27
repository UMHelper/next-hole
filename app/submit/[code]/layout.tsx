import { Viewport } from "next"

export function generateMetadata(
    {params}:{params:any}) {
        const title = `New Post 發表主題 | WHOLE @ UM 澳大討論區`

    return {
        title: title,
    }

}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default function SubmitLayout({children}:{children:any}){
    return(
        children
    )
}