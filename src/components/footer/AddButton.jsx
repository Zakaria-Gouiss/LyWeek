import "./footer.css";

function AddButton({ type, onClick, iconOnly = false, label }) {
  if (type === "save") {
    return (
      <button className="save-notes" onClick={onClick}>
        <i className="fa-solid fa-floppy-disk"></i>
        <span>Save</span>
      </button>
    );
  }
  return (
    <button
      className={`add-button${iconOnly ? " add-button--icon-only" : ""}`}
      onClick={onClick}
      aria-label={iconOnly ? `Add ${type}` : undefined}
      title={iconOnly ? `Add ${type}` : undefined}
    >
      <i className="fa-solid fa-plus"></i>
      {!iconOnly && <span>{label ?? `Add ${type}`}</span>}
    </button>
  );
}
export default AddButton;
