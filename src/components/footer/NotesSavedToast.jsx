import "./notes-saved-toast.css";

function NotesSavedToast({ message, isFading = false }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`notes-saved-toast${isFading ? " is-fading" : ""}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

export default NotesSavedToast;
