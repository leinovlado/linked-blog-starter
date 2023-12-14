type Props = {
  title: string
  content: string
}


const NotePreview = ({ title, content }: Props) => {
  return (
    <span className="note-preview ">
      <span className="note-title">{title}</span>
      <span className="note-content">{content}</span>
    </span>
  )
}

export default NotePreview