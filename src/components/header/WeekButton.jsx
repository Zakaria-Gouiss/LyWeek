import "./header.css";

function WeekButton({ position, onClick }) {
  const label = position === "left" ? "Previous week" : "Next week";

  return (
    <button
      type="button"
      className={position === "left" ? "prev-week" : "next-week"}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {position === "left" ? (
        <>
          <i className="fa-solid fa-circle-left"></i>
          <span>{label}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <i className="fa-solid fa-circle-right"></i>
        </>
      )}
    </button>
  );
}

export default WeekButton;
