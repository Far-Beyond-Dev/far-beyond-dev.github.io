import { docsData } from '@/lib/docs-data'
import DocContent from './doc-content'
  
interface PageProps {
    params: Promise<{ slug: string }>;  // Change to Promise type
}

  
export function generateStaticParams(): { slug: string }[] {
    return docsData.map((doc) => ({
      slug: doc.slug,
    }))
}

export default async function DocPage({ params }: PageProps) {
    // Await the params to resolve the Promise
    const resolvedParams = await params;
    const doc = docsData.find((d) => d.slug === resolvedParams.slug);

    if (!doc) {
        return null; // or a 404 component
    }

    return <DocContent initialDoc={doc} slug={resolvedParams.slug} />;
}