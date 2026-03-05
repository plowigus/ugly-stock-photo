import { MetadataRoute } from 'next'
import { getWorks } from '@/lib/actions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://uglystockphoto.pl'

    // Fetch all works from the database for dynamic indexing
    // Note: Since this is a single page with modals, we are pointing to the home page anchors or just the base
    // However, if we ever add [slug] pages, we would map them here. 
    // For now, we just ensure the base index is solid.

    // If the user adds separate work pages later, we can uncomment this:
    /*
    const works = await getWorks();
    const workUrls = works.map((work) => ({
        url: `${baseUrl}/work/${work.id}`,
        lastModified: new Date(),
    }));
    */

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
    ]
}
