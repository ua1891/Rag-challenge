import styles from "./AnswerCard.module.css";

export default function AnswerCard({ answer, sources }) {
  return (
    <div className={styles.card}>
      <h4>Answer</h4>
      <p>{answer}</p>
      {sources?.length > 0 && (
        <>
          <h5>Source chunks</h5>
          {sources.map((chunk, i) => (
            <details key={i} className={styles.sourceItem}>
              <summary>Source {i + 1}</summary>
              <pre className={styles.sourceText}>{chunk}</pre>
            </details>
          ))}
        </>
      )}
    </div>
  );
}