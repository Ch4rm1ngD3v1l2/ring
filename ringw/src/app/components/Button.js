import styles from "./Button.module.css";

export default function Button({ title, color, onClick }) {
  return (
    <div className={styles["button"]} style={{ background: color }} onClick={onClick}>
      {title}
    </div>
  );
}

// <div className={styles[""]}></div>
