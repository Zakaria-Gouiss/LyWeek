import "./notes-saved-toast.css";

function NotesSavedToast({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="notes-saved-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}

export default NotesSavedToast;
