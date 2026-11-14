import "./header.css";

function SettingsButton({ onClick }) {
  return (
    <button
      type="button"
      className="settings-button"
      onClick={onClick}
      aria-label="Open settings"
      title="Settings"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <path d="M19.4 13a7.8 7.8 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-1.7-1L15 3h-4l-.4 2.9a7.5 7.5 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.8 7.8 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 1.7 1L11 21h4l.4-2.9a7.5 7.5 0 0 0 1.7-1l2.4 1 2-3.4-2.1-1.7ZM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
      </svg>
    </button>
  );
}

export default SettingsButton;
