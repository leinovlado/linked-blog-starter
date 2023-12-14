import Link from 'next/link';
import NotePreview from './note-preview';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

type Props = {
  backlinks: {
    [k: string]: {
      title: string;
      excerpt: string;
    };
  };
};

const Backlinks = ({ backlinks }: Props) => {
  return (
    <>
      {Object.keys(backlinks).map((slug) => {
        const post = backlinks[slug];
        return (
          <Card className="col-4 m-2">
            <Link
              as={slug}
              href="[...slug]"
              className="col-span-1 preview-link"
            >
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text className='card-preview-text'>{post.excerpt}</Card.Text>
              </Card.Body>
            </Link>
          </Card>
        );
      })}
    </>
  );
};

export default Backlinks;
