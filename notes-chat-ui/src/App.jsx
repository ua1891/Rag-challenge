import UploadZone from "./components/UploadZone";
import ChatBox from "./components/ChatBox";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.app}>
      <h1>Chat with Your Notes</h1>
      <UploadZone />
      <ChatBox />
    </div>
  );
}