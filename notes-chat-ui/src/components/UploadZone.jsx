import { useState, useCallback } from "react";
import { uploadFile } from "../api";
import styles from "./UploadZone.module.css";

export default function UploadZone({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error'|'loading', message }

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setStatus({ type: "loading", message: `Uploading ${file.name}...` });
    try {
      const result = await uploadFile(file);
      setStatus({ type: "success", message: result.message });
      onUploadSuccess?.();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  }, [onUploadSuccess]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
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
      onClick={() => document.getElementById("fileInput").click()}
    >
      <input
        id="fileInput"
        type="file"
        className={styles.hiddenInput}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <p>Drag & drop a notes file here, or click to browse</p>
      {status && <p className={statusClass}>{status.message}</p>}
    </div>
  );
}