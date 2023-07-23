import { useEffect, useState } from "react";
import App from "./App";
import { socket } from "./socket";
import GamePhase from "./Game/GamePhase";

export default function SocketStuff() {
  const [connected, setConnected] = useState(false);
  const [phase, setPhase] = useState("NAME_PHASE");
  const [lobbies, setLobbies] = useState([]);
  const [username, setUsername] = useState("");
  const [lobbyName, setLobbyName] = useState("");
  const [password, setPassword] = useState("");

  const [drawerId, setDrawerId] = useState();
  const [options, setOptions] = useState([]);

  const [gameStep, setGameStep] = useState("CHOOSE");
  const [gameWord, setGameWord] = useState("");

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
          console.log("727", message.lobbies);
          break;
        case "NEW_LOBBY":
          setUsername(message.username);
          setPassword(message.password);
          setLobbyName(message.lobbyName);
          setLobbies(message.lobbies);
          console.log("msgreggin", message.lobbies);
          console.log("reggin", lobbies);
          setPhase("IN_LOBBY");
          break;

        case "GET_WORDS":
          setOptions(message.options);
          break;

        case "MAKE_ME_DRAWER":
          setDrawerId(message.drawerId);
          break;

        case "CHOOSE_WORD":
          setGameStep("PLAY");
          setGameWord(message.option);
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

      <h2>Game stuff:</h2>
      <button
        onClick={() => {
          socket.emit("message", { type: "MAKE_ME_DRAWER" });
        }}
      >
        Make me drawer
      </button>

      <button
        onClick={() => {
          socket.emit("message", { type: "GET_WORDS" });
        }}
      >
        Get words
      </button>
      <GamePhase
        options={options}
        drawerId={drawerId}
        gameWord={gameWord}
        gameStep={gameStep}
      />
    </>
  );
}
