import { useState } from "react";
import UploadZone from "./components/UploadZone";
import ChatBox from "./components/ChatBox";
import StoredNotesPanel from "./components/StoredNotesPanel";
import styles from "./App.module.css";

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h1>NexusNotes</h1>
        <p>Your intelligent document assistant</p>
      </header>
      
      <div className={styles.mainLayout}>
        <aside className={styles.sidebar}>
          <UploadZone onUploadSuccess={() => setRefreshKey((k) => k + 1)} />
          <StoredNotesPanel refreshKey={refreshKey} />
        </aside>
        
        <main className={styles.chatArea}>
          <ChatBox />
        </main>
      </div>
    </div>
  );
}