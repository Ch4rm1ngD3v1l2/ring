import { v4 } from "uuid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./page.module.css";
import TextInput from "@/app/components/TextInput";
import Button from "@/app/components/Button";

export default function Welcome() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    navigate(`/room?id=${v4()}`);
  };

  const joinRoom = () => {
    navigate(`/room?id=${roomId}`);
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["container__wrapper"]}>
        <div className={styles["logo"]}>Ring</div>

        <div className={styles["description"]}>Realtime videochat application built on WebRTC and SignalR</div>

        <TextInput placeholder="Өрөөний дугаараа энд оруулна уу" onChange={setRoomId} />

        <Button title="Холбогдох" onClick={joinRoom} />

        <Button title="Шинээр өрөө нээх" color="#E94560" onClick={createRoom} />
      </div>
    </div>
  );
}

// <div className={styles[""]}></div>
