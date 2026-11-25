function NotesHeading({ className = "" }) {
  return (
    <div className={`notes-heading ${className}`.trim()}>
      <h2>Notes</h2>
      <p className="notes-save-hint">Ctrl+Enter to save</p>
    </div>
  );
}

export default NotesHeading;
