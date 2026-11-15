import { useState } from "react";
import "./links-section.css";

function LinkForm({ link, onCancel, onSave, onError, saving }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name").trim();
    const url = formData.get("url").trim();

    try {
      await onSave({ name, url });
    } catch (error) {
      onError(error.message);
    }
  }

  return (
    <form className="class-link-form" onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input
          name="name"
          type="text"
          defaultValue={link?.name ?? ""}
          required
        />
      </label>
      <label>
        <span>URL</span>
        <input
          name="url"
          type="text"
          defaultValue={link?.url ?? ""}
          placeholder="Enter a URL or app link"
          required
        />
      </label>
      <div className="class-link-form-actions">
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function LinksSection({
  classId,
  links = [],
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  collapsible = false,
}) {
  const [addingLink, setAddingLink] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSave(linkId, link) {
    setSaving(true);
    setErrorMessage("");
    try {
      if (linkId === null) {
        await onAddLink({ ...link, classId });
        setAddingLink(false);
      } else {
        await onUpdateLink(linkId, link);
        setEditingLinkId(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(linkId) {
    setSaving(true);
    setErrorMessage("");
    try {
      await onDeleteLink(linkId);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  function content() {
    return (
      <>
        <ul className="class-links-list">
          {links.map((link) => (
            <li key={link.id}>
              {editingLinkId === link.id ? (
                <LinkForm
                  link={link}
                  saving={saving}
                  onSave={(updatedLink) => handleSave(link.id, updatedLink)}
                  onCancel={() => {
                    setEditingLinkId(null);
                    setErrorMessage("");
                  }}
                  onError={setErrorMessage}
                />
              ) : (
                <div className="class-link-row">
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.name}
                  </a>
                  <div className="class-link-actions">
                    <button
                      type="button"
                      aria-label={`Edit ${link.name}`}
                      onClick={() => {
                        setErrorMessage("");
                        setEditingLinkId(link.id);
                        setAddingLink(false);
                      }}
                    >
                      <i className="fa-solid fa-pencil" aria-hidden="true"></i>
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${link.name}`}
                      onClick={() => handleDelete(link.id)}
                      disabled={saving}
                    >
                      <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
          {links.length === 0 && !addingLink && (
            <li className="class-links-empty">No links yet.</li>
          )}
        </ul>

        {addingLink && (
          <LinkForm
            saving={saving}
            onSave={(newLink) => handleSave(null, newLink)}
            onCancel={() => {
              setAddingLink(false);
              setErrorMessage("");
            }}
            onError={setErrorMessage}
          />
        )}

        {errorMessage && (
          <p className="class-links-error" role="alert">
            {errorMessage}
          </p>
        )}

        {!addingLink && (
          <button
            type="button"
            className="class-link-add"
            onClick={() => {
              setErrorMessage("");
              setEditingLinkId(null);
              setAddingLink(true);
            }}
          >
            + Add link
          </button>
        )}
      </>
    );
  }

  if (collapsible) {
    return (
      <details className="class-links class-links-collapsible">
        <summary>Links ({links.length})</summary>
        {content()}
      </details>
    );
  }

  return (
    <section className="class-links">
      <h3>Links</h3>
      {content()}
    </section>
  );
}

export default LinksSection;
