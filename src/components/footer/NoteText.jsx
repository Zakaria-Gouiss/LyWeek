function NoteText({ notes, setNotes }) {
  return (
    <textarea
      value={notes}
      onChange={(event) => setNotes(event.target.value)}
      className="notes-input"
      placeholder="Write any miscellaneous notes here..."
    ></textarea>
  );
}
export default NoteText;
