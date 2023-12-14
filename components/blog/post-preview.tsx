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

const PostPreview = ({
  title,
  date,
  excerpt,
  author,
  slug,
}: Props) => {
  console.log(excerpt);
  return (
    <article className="mt-3">
            <Link as={`/${slug}`} href="/[...slug]">
      <div>
        <header>
          <h4>
              {title}
          </h4>
        </header>
        <div className="post-preview-text">{excerpt}</div>

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
  );
};

export default PostPreview;
