import { useEffect, useState } from "react";
import App from "./App";
import { socket } from "./socket";
import Canvas from "./Canvas";

export default function SocketStuff() {
  const [connected, setConnected] = useState(false);
  const [phase, setPhase] = useState("NAME_PHASE");
  const [lobbies, setLobbies] = useState([]);
  const [username, setUsername] = useState("");

  const [lobbyName, setLobbyName] = useState("");
  const [password, setPassword] = useState("");
  const [playerList, setPlayerList] = useState([]);

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
        case "SEE_LOBBY":
          setLobbies(message.lobbies);
          break;
        case "NEW_LOBBY":
          setPlayerList(message);
          setPassword(message.password);
          setLobbyName(message.lobbyName);
          setLobbies(message.lobbies);
          setPlayerList(message.players);
          setPhase("IN_LOBBY");
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
      <App
        username={username}
        phase={phase}
        lobbies={lobbies}
        lobbyName={lobbyName}
        password={password}
        playerList={playerList}
      />
      <Canvas />
    </>
  );
}
