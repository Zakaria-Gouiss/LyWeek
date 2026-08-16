function WeekButton({ position, onClick }) {
  return (
    <button
      type="button"
      className={position === "left" ? "prev-week" : "next-week"}
      onClick={onClick}
    >
      {position === "left" ? (
        <>
          <i className="fa-solid fa-circle-left"></i>
          <span>Previous week</span>
        </>
      ) : (
        <>
          <span>Next week</span>
          <i className="fa-solid fa-circle-right"></i>
        </>
      )}
    </button>
  );
}

export default WeekButton;
