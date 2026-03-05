import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://uglystockphoto.pl'

    // Currently, the site is a single-page application with modals for works.
    // If dynamic routes like /work/[id] are added later, they should be fetched and mapped here.

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
    ]
}
