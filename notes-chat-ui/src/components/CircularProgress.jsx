import styles from "./CircularProgress.module.css";

export default function CircularProgress({ progress = 0, size = 60, strokeWidth = 4, statusText = "" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={styles.container}>
      <div className={styles.svgWrapper} style={{ width: size, height: size }}>
        <svg width={size} height={size} className={styles.svg}>
          {/* Background Circle */}
          <circle
            className={styles.circleBg}
            stroke="var(--border-color)"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress Circle */}
          <circle
            className={styles.circleProgress}
            stroke="var(--accent-primary)"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className={styles.textContainer}>
          <span className={styles.percentage}>{Math.round(progress)}%</span>
        </div>
      </div>
      {statusText && <p className={styles.statusText}>{statusText}</p>}
    </div>
  );
}
