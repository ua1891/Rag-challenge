import { useState } from "react";
import UploadZone from "./components/UploadZone";
import ChatBox from "./components/ChatBox";
import StoredNotesPanel from "./components/StoredNotesPanel";
import styles from "./App.module.css";

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className={styles.app}>
      <h1>Chat with Your Notes</h1>
      <UploadZone onUploadSuccess={() => setRefreshKey((k) => k + 1)} />
      <StoredNotesPanel refreshKey={refreshKey} />
      <ChatBox />
    </div>
  );
}