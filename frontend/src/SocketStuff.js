import { useEffect } from "react";
import App from "./App";
import { socket } from "./socket";

export default function SocketStuff() {
  useEffect(() => {
    function onConnect() {
      console.log("Connected");
    }

    function onDisconnect() {
      console.log("Disconnected");
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

  return <App />;
}
