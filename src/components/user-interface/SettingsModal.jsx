import { useState } from "react";
import ViewToggle from "../header/ViewToggle.jsx";

function SettingsModal({
  user,
  semester,
  classList,
  onClose,
  onSaveName,
  onSaveSemester,
  onEditClass,
  onLogout,
  onNotify,
  viewMode,
  onViewModeChange,
  isOrbitSupported = true,
}) {
  const [name, setName] = useState(user?.name ?? "");
  const [semesterName, setSemesterName] = useState(semester?.name ?? "");
  const [startDate, setStartDate] = useState(semester?.startDate ?? "");
  const [endDate, setEndDate] = useState(semester?.endDate ?? "");
  const [selectedViewMode, setSelectedViewMode] = useState(viewMode);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    try {
      const updatedName = name.trim();
      if (updatedName !== user?.name) {
        await onSaveName(updatedName);
      }

      const semesterChanged =
        semester &&
        (semesterName.trim() !== semester.name ||
          startDate !== semester.startDate ||
          endDate !== semester.endDate);
      if (semesterChanged) {
        await onSaveSemester({
          ...semester,
          name: semesterName.trim(),
          startDate,
          endDate,
        });
      }
    } catch {
      setIsSaving(false);
      onNotify("Failed to save preferences");
      return;
    }

    setIsSaving(false);
    onViewModeChange(selectedViewMode);
    onClose();
    onNotify("Settings successfuly saved!");
  }

  return (
    <div className="assignment-modal-overlay">
      <div
        className="assignment-modal settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="assignment-modal-header">
          <h2 id="settings-title" className="assignment-modal-title">
            Settings
          </h2>
          <button
            type="button"
            className="modal-close"
            aria-label="Close settings"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form className="assignment-form" onSubmit={handleSubmit}>
          <section className="settings-section">
            <h3 className="settings-section-title">Profile</h3>
            <div className="form-group">
              <label htmlFor="settings-name">Name</label>
              <input
                id="settings-name"
                name="settings-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
          </section>

          <section className="settings-section">
            <h3 className="settings-section-title">Classic vs Orbit</h3>
            <ViewToggle
              viewMode={selectedViewMode}
              onViewModeChange={setSelectedViewMode}
              orbitDisabled={!isOrbitSupported}
            />
          </section>

          {semester && (
            <section className="settings-section">
              <h3 className="settings-section-title">Semester</h3>
              <div className="form-group">
                <label htmlFor="settings-semester-name">Semester Name</label>
                <input
                  id="settings-semester-name"
                  name="settings-semester-name"
                  type="text"
                  value={semesterName}
                  onChange={(event) => setSemesterName(event.target.value)}
                  required
                />
              </div>
              <div className="settings-date-fields">
                <div className="form-group">
                  <label htmlFor="settings-semester-start">Start Date</label>
                  <input
                    id="settings-semester-start"
                    name="settings-semester-start"
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="settings-semester-end">End Date</label>
                  <input
                    id="settings-semester-end"
                    name="settings-semester-end"
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    required
                  />
                </div>
              </div>
            </section>
          )}

          <div className="settings-section">
            <h3 className="settings-section-title">Your Classes</h3>
            {classList.length ? (
              <ul className="settings-class-list">
                {classList.map((course) => (
                  <li className="settings-class-item" key={course.id}>
                    <span>{course.name}</span>
                    <button
                      type="button"
                      className="settings-edit-class"
                      onClick={() => onEditClass(course)}
                    >
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="settings-empty">No classes added yet.</p>
            )}
          </div>

          <button type="submit" className="modal-submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </form>

        <div className="settings-logout">
          <button type="button" className="modal-delete" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;