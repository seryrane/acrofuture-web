import styles from "./SkipLink.module.css";

// 첫 포커스: 본문으로 건너뛰기
export function SkipLink() {
  return (
    <a href="#main" className={styles.skip}>
      본문으로 건너뛰기
    </a>
  );
}
