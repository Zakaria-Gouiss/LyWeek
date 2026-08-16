function AddButton({ type, onClick }) {
  if (type === "save") {
    return (
      <button className="save-notes" onClick={onClick}>
        <i className="fa-solid fa-floppy-disk"></i>
        <span>Save</span>
      </button>
    );
  }
  return (
    <button className="add-button" onClick={onClick}>
      <i className="fa-solid fa-plus"></i>
      <span>Add {type}</span>
    </button>
  );
}
export default AddButton;
