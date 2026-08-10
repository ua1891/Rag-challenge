import { useState, useCallback } from "react";
import { uploadFile } from "../api";
import CircularProgress from "./CircularProgress";
import styles from "./UploadZone.module.css";

export default function UploadZone({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error'|'loading', message, progress: 0-100 }

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setStatus({ type: "loading", message: `Uploading ${file.name}...`, progress: 0 });
    try {
      const result = await uploadFile(file, (percent) => {
        setStatus({ 
          type: "loading", 
          progress: percent, 
          message: percent >= 100 ? "Finalizing..." : `Processing and Embedding...` 
        });
      });
      setStatus({ type: "success", message: result.message, progress: 100 });
      onUploadSuccess?.();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  }, [onUploadSuccess]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (status?.type === "loading") return;
    handleFile(e.dataTransfer.files[0]);
  };

  const dropzoneClass = isDragging
    ? `${styles.dropzone} ${styles.dropzoneActive}`
    : styles.dropzone;

  const statusClass =
    status?.type === "error" ? styles.statusError : styles.statusSuccess;

  return (
    <div
      className={dropzoneClass}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => { if (status?.type !== "loading") document.getElementById("fileInput").click() }}
    >
      <input
        id="fileInput"
        type="file"
        className={styles.hiddenInput}
        onChange={(e) => handleFile(e.target.files[0])}
        disabled={status?.type === "loading"}
      />
      
      {status?.type === "loading" ? (
        <CircularProgress 
          progress={status.progress} 
          statusText={status.message} 
        />
      ) : (
        <>
          <div className={styles.uploadIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <p className={styles.uploadText}>Drag & drop a notes file here, or click to browse</p>
          {status && <p className={statusClass}>{status.message}</p>}
        </>
      )}
    </div>
  );
}