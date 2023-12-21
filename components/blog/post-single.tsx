import React from 'react';
import Author from '../../interfaces/author';
import Backlinks from '../misc/backlinks';
import PostBody from './post-body';
import PostMeta from './post-meta';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

type Props = {
  title: string;
  content: string;
  date?: string;
  author?: Author;
  backlinks: {
    [k: string]: {
      title: string;
      excerpt: string;
    };
  };
};

function PostSingle({
  title,
  date,
  author,
  content,
  backlinks,
}: Props) {
  return (
    <>
      <section className="mt-5 minh80">
        <div className="mx-auto">
          <div className="pt-10 pb-10">
            <div className="max-w-3xl mx-auto lg:max-w-none">
              <article>
                {/* Article header */}
                <header className="max-w-3xl mx-auto mb-2">
                  {/* Title */}
                  <h1 className="h1 mb-4 text-6xl">{title}</h1>
                </header>

                {/* Article content */}

                {/* Main content */}
                <div>
                  {/* Article meta */}
                  {(author || date) && (
                    <>
                      <PostMeta author={author} date={date} />
                      <hr className="w-16 h-px pt-px bg-gray-200 border-0 my-6" />
                    </>
                  )}

                  {/* Article body */}
                  <PostBody content={content} />
                </div>

                {/* Article footer */}
              </article>
            </div>
          </div>
        </div>
      </section>
      <div className="container mt-5">
        {Object.keys(backlinks).length > 0 && (
          <>
            <h3>Также статья упоминается в:</h3>
            <div className="row">
              <Backlinks backlinks={backlinks} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PostSingle;
