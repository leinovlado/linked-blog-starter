import Author from '../../interfaces/author';
import DateFormatter from '../misc/date-formatter';

type Props = {
  author?: Author;
  date?: string;
};

const PostMeta = ({ author, date }: Props) => {
  if (!(author || date)) return null;
  return (
    <>
      <div>
        {author && (
          <>
            <span>By </span>
            <a>{author.name}</a>
          </>
        )}
        {author && date && <span> · </span>}
        {date && (
          <span>
            <DateFormatter dateString={date} />
          </span>
        )}
      </div>
    </>
  );
};

export default PostMeta;
