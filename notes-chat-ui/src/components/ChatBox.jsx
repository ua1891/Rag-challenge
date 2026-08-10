import { useState } from "react";
import { askQuestion } from "../api";
import AnswerCard from "./AnswerCard";
import styles from "./ChatBox.module.css";

export default function ChatBox() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await askQuestion(question);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Ask a question about your notes..."
        />
        <button className={styles.button} onClick={handleAsk} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {result && <AnswerCard answer={result.answer} sources={result.sources} />}
    </div>
  );
}