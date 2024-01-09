import './globals.css'
import '@smastrom/react-rating/style.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from "react";

import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner"
import Script from 'next/script';
import { ClerkProvider } from '@clerk/nextjs';
import type { Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Home | WHOLE @ UM',
    description: 'BBS platform for University of Macau',
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <head>
                    <Script id='gtm'>{`(function(w,d,s,l,i){w[l] = w[l] || [];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','${process.env.GTM_ID}');`}</Script>

                    <meta name='theme-color' content='#2563EB' />
                    <meta name='apple-mobile-web-app-status-bar-style' content='#2563EB' />
                    <link rel="manifest" href="/manifest.webmanifest" />
                    <link rel="icon" href="/favicon.png" sizes="any" />
                    <link
                        rel="apple-touch-icon"
                        href="/icon/72.jpg"
                    />
                </head>
                <body className={cn(inter.className)}>
                    <div className='min-h-screen min-w-full'>
                        <Navbar />
                        <div>
                            {children}
                        </div>
                    </div>
                    <Footer />
                    <Toaster richColors/>
                </body>
            </html>
        </ClerkProvider>
    )
}
