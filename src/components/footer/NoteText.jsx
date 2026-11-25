import "./footer.css";

function NoteText({ notes, setNotes, onSave }) {
  return (
    <textarea
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      onKeyDown={(event) => {
        if (
          event.ctrlKey &&
          event.key === "Enter" &&
          !event.repeat &&
          !event.isComposing
        ) {
          event.preventDefault();
          onSave();
        }
      }}
      className="notes-input"
      placeholder="Write any miscellaneous notes here..."
    ></textarea>
  );
}
export default NoteText;
