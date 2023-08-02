import styles from "./TextInput.module.css";

export default function TextInput({ onChange, placeholder }) {
  return (
    <div className={styles["text-input"]}>
      <input autoCorrect="false" placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

// <div className={styles[""]}></div>
