import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const indexSitemap:any=[
        {
            url: 'https://umeh.top',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
    ]
    return [...indexSitemap,]
}