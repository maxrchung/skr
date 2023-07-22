import { useEffect, useState } from "react";
import App from "./App";
import { socket } from "./socket";

export default function SocketStuff() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    function onMessage(message) {
      console.log("Message", message);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onMessage);
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
      <App />
    </>
  );
}
