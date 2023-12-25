import Link from 'next/link';
import type Author from '../../interfaces/author';
import PostMeta from './post-meta';

type Props = {
  title: string;
  date?: string;
  excerpt: string;
  author?: Author;
  slug: string;
};

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  } else {
    return text;
  }
}

const PostPreview = ({
  title,
  date,
  excerpt,
  author,
  slug,
}: Props) => {
  console.log(excerpt);
  const postExcerpt = excerpt; // предполагается, что post.excerpt содержит текст
  const truncatedText = truncateText(excerpt, 200);
  return (
    <>
      <article className="mt-3 pb-3 w-100 border-bottom">
        <Link as={`/${slug}`} href="/[...slug]">
          <div>
            <header>
              <h4>{title}</h4>
            </header>
            <div className="post-preview-text">{truncatedText}</div>
          </div>
          <Link
            as={`/${slug}`}
            href="/[...slug]"
            className="block shrink-0 ml-6"
          >
            <span className="sr-only d-none">Читать...</span>
          </Link>
        </Link>
      </article>
    </>
  );
};

export default PostPreview;
