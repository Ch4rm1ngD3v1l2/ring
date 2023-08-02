import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useSearchParams } from "react-router-dom";
import { HubConnectionBuilder } from "@microsoft/signalr";

export default function Room() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFriendConnected, setFriendConnected] = useState(false);

  useEffect(() => {
    const init = async () => {
      const groupId = searchParams.get("id");
      const remoteStream = document.getElementById("remoteVideo");

      // WebRTC - START
      const pcConfig = {
        iceServers: [
          {
            urls: "stun:stun.relay.metered.ca:80",
          },
          {
            urls: "turn:a.relay.metered.ca:80",
            username: "d6b434dae7801ce2c6912c1a",
            credential: "kDgOPnt7UJP1IT3/",
          },
          {
            urls: "turn:a.relay.metered.ca:80?transport=tcp",
            username: "d6b434dae7801ce2c6912c1a",
            credential: "kDgOPnt7UJP1IT3/",
          },
          {
            urls: "turn:a.relay.metered.ca:443",
            username: "d6b434dae7801ce2c6912c1a",
            credential: "kDgOPnt7UJP1IT3/",
          },
          {
            urls: "turn:a.relay.metered.ca:443?transport=tcp",
            username: "d6b434dae7801ce2c6912c1a",
            credential: "kDgOPnt7UJP1IT3/",
          },
        ],
      };

      const pc = new RTCPeerConnection(pcConfig);
      window.pc = pc;

      pc.ontrack = (event) => {
        setFriendConnected(true);
        remoteVideo.srcObject = event.streams[0];
      };

      pc.onicecandidate = (event) => {
        connection.invoke("SendMessage", groupId, { type: "candidate", data: event?.["candidate"] });
      };

      pc.onconnectionstatechange = (event) => {
        console.log(event);
      };

      // WebRTC - FINISH

      // Camera streaming - START
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      document.getElementById("localVideo").srcObject = stream;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
      // Camera streaming - FINISH

      // Signaling - START
      const connection = new HubConnectionBuilder().withUrl("https://localhost:7142/chathub", { withCredentials: false }).build();

      connection.on("ReceiveMessage", (message) => {
        switch (message["type"]) {
          case "ready":
            createOfferAndSend();
            break;
          case "offer":
            console.log("Tand offer orj irlee");
            handleOfferAndSendAnswer(message["data"]);
            break;
          case "answer":
            console.log("Tand hariult orj irlee");
            handleAnswer(message["data"]);
            break;

          case "candidate":
            console.log("Tand candidate orj irlee");
            handleCandidate(message["data"]);
            break;
        }
      });

      const createOfferAndSend = async () => {
        const offer = await pc.createOffer();
        pc.setLocalDescription(offer);
        connection.invoke("SendMessage", groupId, { type: "offer", data: offer });
      };

      const handleOfferAndSendAnswer = async (offer) => {
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        connection.invoke("SendMessage", groupId, { type: "answer", data: answer });
      };

      const handleAnswer = async (answer) => {
        await pc.setRemoteDescription(answer);
      };

      const handleCandidate = async (candidate) => {
        await pc.addIceCandidate(candidate);
      };

      connection
        .start()
        .then(async () => {
          await connection.invoke("JoinRoom", groupId);
          await connection.invoke("SendMessage", groupId, { type: "ready" });
        })
        .catch((err) => {
          console.log(err);
        });
      //Signalling - FINISH
    };

    init();
  }, []);

  return (
    <div className={styles["room"]}>
      <video className={styles["localVideo"] + (isFriendConnected ? " " + styles["localVideo--connected"] : "")} id="localVideo" draggable="true" autoPlay></video>

      {(isFriendConnected || 1) && <video className={styles["remoteVideo"]} id="remoteVideo" autoPlay></video>}
    </div>
  );
}

// <div className={styles[""]}></div>
