function NoteText({ notes, setNotes }) {
  return (
    <textarea
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      className="notes-input"
      placeholder="Write any miscellaneous notes here..."
    ></textarea>
  );
}
export default NoteText;
