import { useEffect, useState } from "react";
import App from "./App";
import { socket } from "./socket";
import Canvas from "./Canvas";

export default function SocketStuff() {
  const [connected, setConnected] = useState(false);
  const [phase, setPhase] = useState("NAME_PHASE");
  const [lobbies, setLobbies] = useState([]);
  const [username, setUsername] = useState(false);

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    function onMessage(message) {
      console.log("message", message);

      switch (message.type) {
        case "SET_NAME":
          setUsername(message.value);
          setPhase("OUT_LOBBY");
          break;

        default:
          console.log("Unknown message", message);
          break;
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
    };
  }, []);

  return (
    <>
      <div>You are currently: {connected ? "Connected" : "Disconnected"}</div>
      <button
        onClick={() => {
          socket.emit("message", "hi");
        }}
      >
        hi
      </button>
      <App username={username} phase={phase} lobbies={lobbies} />
      <Canvas />
    </>
  );
}
