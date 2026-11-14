import "./view-toggle.css";

function ViewToggle({ viewMode, onViewModeChange, orbitDisabled = false }) {
  return (
    <div className="view-toggle" role="group" aria-label="Choose layout">
      <button
        type="button"
        className={viewMode === "classic" ? "is-active" : ""}
        aria-pressed={viewMode === "classic"}
        onClick={() => onViewModeChange("classic")}
      >
        Classic
      </button>
      <button
        type="button"
        className={viewMode === "orbit" ? "is-active" : ""}
        aria-pressed={viewMode === "orbit"}
        disabled={orbitDisabled}
        title={
          orbitDisabled ? "Orbit view is unavailable below 450px" : undefined
        }
        onClick={() => onViewModeChange("orbit")}
      >
        Orbit
      </button>
    </div>
  );
}

export default ViewToggle;
