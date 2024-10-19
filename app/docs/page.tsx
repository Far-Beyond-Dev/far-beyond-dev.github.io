// File: app/docs/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { DocsCards } from '../components/DocsCards';
import { marked } from 'marked';

interface DocFile {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    firstImage?: string;
    htmlContent: string;
  }
  
  function parseFileContent(fileContents: string, slug: string): DocFile | null {
    const { data, content } = matter(fileContents);
  
    if (!data.title) {
      console.warn(`Document ${slug} does not have a valid title and will be skipped.`);
      return null;
    }
  
    const excerpt = data.excerpt || content.slice(0, 150) + '...';
  
    return {
      slug,
      title: data.title,
      excerpt,
      content,
      firstImage: data.image || undefined,
      htmlContent: marked(content)
    };
  }
  
  async function getDocs(): Promise<DocFile[]> {
    const docsDirectory = path.join(process.cwd(), 'docs');
    const filenames = fs.readdirSync(docsDirectory);
  
    const docs = filenames
      .map((filename) => {
        const filePath = path.join(docsDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const slug = filename.replace('.md', '');
        
        return parseFileContent(fileContents, slug);
      })
      .filter((doc): doc is DocFile => doc !== null);
  
    return docs;
  }

export default async function DocsPage() {
  const docs = await getDocs();

  return (
    <div className="container mx-auto px-4 py-8 pt-52 min-h-screen max-w-[50%]">
      <h1 className="text-3xl font-bold mb-8 text-center">Documentation</h1>
      <DocsCards docs={docs} />
    </div>
  );
}