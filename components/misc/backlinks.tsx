import Link from 'next/link';
import NotePreview from './note-preview';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Post from '../../pages/[...slug]';

type Props = {
  backlinks: {
    [k: string]: {
      title: string;
      excerpt: string;
    };
  };
};

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  } else {
    return text;
  }
}

// Пример использования

const Backlinks = ({ backlinks }: Props) => {

  return (
    <>
      {Object.keys(backlinks).map((slug) => {
        const post = backlinks[slug];
          const postExcerpt = post.excerpt; // предполагается, что post.excerpt содержит текст
          const truncatedText = truncateText(postExcerpt, 200);
        return (
          <Card className="col-9 col-md-6 m-2">
            <Link
              as={slug}
              href="[...slug]"
              className="col-span-1 preview-link"
            >
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text className="card-preview-text">
                  {truncatedText}
                </Card.Text>
              </Card.Body>
            </Link>
          </Card>
        );
      })}
    </>
  );
};

export default Backlinks;
