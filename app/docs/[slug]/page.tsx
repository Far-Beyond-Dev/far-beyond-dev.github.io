import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import styles from './markdown-styles.module.css';

export async function generateStaticParams() {
  const docsDirectory = path.join(process.cwd(), 'docs');
  const filenames = fs.readdirSync(docsDirectory);
  return filenames.map((filename) => ({
    slug: filename.replace('.md', ''),
  }));
}

function processMarkdown(markdown: string): string {
  // Use marked to render the markdown to HTML
  const htmlContent = marked(markdown);

  console.log('HTML content preview:', htmlContent.substring(0, 500) + '...');

  return htmlContent;
}

async function getDocContent(slug: string) {
  const filePath = path.join(process.cwd(), 'docs', `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);
  const htmlContent = processMarkdown(content);
  return { content: htmlContent };
}

export default async function DocPage({ params }: { params: { slug: string } }) {
  const { content } = await getDocContent(params.slug);
  return (
    <div className="container mx-auto px-4 py-8 pt-32 max-w-[60%] content-center">
      <div className="w-full">
        <div
          className={styles.markdownContent}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}