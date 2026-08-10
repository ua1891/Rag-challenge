import { useEffect, useState, useCallback } from "react";
import { getStoredNotes, deleteNote } from "../api";
import styles from "./StoredNotesPanel.module.css";

export default function StoredNotesPanel({ refreshKey }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null); // The filename of the note to delete

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStoredNotes();
      setNotes(data.notes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // refetch automatically whenever refreshKey changes (e.g. after a new upload)
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes, refreshKey]);

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    setLoading(true);
    try {
      await deleteNote(noteToDelete);
      setNoteToDelete(null);
      await fetchNotes(); // refresh list after deletion
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setNoteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setNoteToDelete(null);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h4>Stored Notes ({notes.length})</h4>
        <button className={styles.refreshButton} onClick={fetchNotes} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <p style={{ color: "#EF4444", fontSize: "14px" }}>{error}</p>}
      {!loading && notes.length === 0 && !error && (
        <p className={styles.empty}>No notes stored yet — upload a file to get started.</p>
      )}

      {notes.map((note) => (
        <div key={note.filename} className={styles.noteRow}>
          <span>{note.filename}</span>
          <div className={styles.noteActions}>
            <span className={styles.chunkCount}>{note.chunk_count} chunks</span>
            <button 
              onClick={() => setNoteToDelete(note.filename)} 
              className={styles.deleteButton}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Custom Confirmation Modal */}
      {noteToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4>Delete Note</h4>
            <p>Are you sure you want to delete <strong>{noteToDelete}</strong>? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={cancelDelete} disabled={loading}>
                Cancel
              </button>
              <button className={styles.confirmButton} onClick={confirmDelete} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
