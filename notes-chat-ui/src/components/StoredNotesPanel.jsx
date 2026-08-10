import { useEffect, useState, useCallback } from "react";
import { getStoredNotes, deleteNote } from "../api";
import styles from "./StoredNotesPanel.module.css";

export default function StoredNotesPanel({ refreshKey }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleDelete = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) return;
    setLoading(true);
    try {
      await deleteNote(filename);
      await fetchNotes(); // refresh list after deletion
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h4>Stored Notes ({notes.length})</h4>
        <button className={styles.refreshButton} onClick={fetchNotes} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && notes.length === 0 && !error && (
        <p className={styles.empty}>No notes stored yet — upload a file to get started.</p>
      )}

      {notes.map((note) => (
        <div key={note.filename} className={styles.noteRow}>
          <span>{note.filename}</span>
          <div className={styles.noteActions}>
            <span className={styles.chunkCount}>{note.chunk_count} chunks</span>
            <button 
              onClick={() => handleDelete(note.filename)} 
              className={styles.deleteButton}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
