import { useEffect, useState } from "react";
import App from "./App";
import { socket } from "./socket";

export default function SocketStuff() {
  const [connected, setConnected] = useState(false);
  const [phase, setPhase] = useState("NAME_PHASE");
  const [lobbies, setLobbies] = useState([]);
  const [name, setName] = useState("");

  const [lobbyId, setLobbyId] = useState("");
  const [lobbyName, setLobbyName] = useState("");
  const [password, setPassword] = useState("");
  const [playerList, setPlayerList] = useState([]);

  const [drawerId, setDrawerId] = useState();
  const [options, setOptions] = useState([]);

  const [gameStep, setGameStep] = useState("CHOOSE");
  const [gameWord, setGameWord] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [endTime, setEndTime] = useState(0);

  const [winner, setWinner] = useState("");

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
          setName(message.value);
          setPhase("OUT_LOBBY");
          break;
        case "SEE_LOBBY":
          setLobbies(message.lobbies);
          break;
        case "NEW_LOBBY":
          setPassword(message.password);
          setLobbyName(message.lobbyName);
          setLobbyId(message.lobbyId);
          setLobbies(message.lobbies);
          setPlayerList(message.playerList);
          setPhase("IN_LOBBY");
          break;

        case "JOIN_LOBBY":
          setPlayerList(message.playerList);
          setLobbyId(message.lobbyId);
          setLobbyName(message.lobbyName);
          setPhase("IN_LOBBY");
          break;

        case "PLAYER_JOINED":
          setPlayerList(message.playerList);
          break;

        case "START_GAME":
          setPhase("GAME");
          setIsCorrect(false);
          setDrawerId(message.drawerId);
          setOptions(message.options);
          setGameWord("");
          setGameStep("CHOOSE");
          setWinner("");
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
          setEndTime(message.endTime);
          break;

        case "GOT_ANSWER":
          if (socket.id === message.answerId) {
            setIsCorrect(true);
          }
          setPlayerList(message.playerList);
          break;

        case "RESET_ROUND":
          setIsCorrect(false);
          setDrawerId(message.drawerId);
          setOptions(message.options);
          setGameWord("");
          setGameStep("CHOOSE");
          setPlayerList(message.playerList);
          break;

        case "END_GAME":
          setPhase("IN_LOBBY");
          setWinner(message.winnerId);
          setPlayerList(message.playerList);
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
      <div>You are ID: {socket.id}</div>
      <div>You're name: {name}</div>
      <button
        onClick={() => {
          socket.emit("message", "hi");
        }}
      >
        hi
      </button>
      <button onClick={() => setPhase("NAME_PHASE")}>Set name phase</button>
      <button onClick={() => setPhase("OUT_LOBBY")}>Set out lobby phase</button>
      <button onClick={() => setPhase("IN_LOBBY")}>Set in lobby phase</button>
      <button onClick={() => setPhase("GAME")}>Set game phase</button>

      <button onClick={() => setGameStep("CHOOSE")}>Set game ChooseStep</button>
      <button onClick={() => setGameStep("PLAY")}>Set game PlayStep</button>
      <button
        onClick={() => socket.emit("message", { type: "MAKE_ME_DRAWER" })}
      >
        Make me drawer
      </button>

      <button onClick={() => socket.emit("message", { type: "GET_WORDS" })}>
        Get words
      </button>

      <App
        name={name}
        phase={phase}
        lobbies={lobbies}
        lobbyName={lobbyName}
        password={password}
        playerList={playerList}
        options={options}
        drawerId={drawerId}
        gameStep={gameStep}
        gameWord={gameWord}
        isCorrect={isCorrect}
        endTime={endTime}
        winner={winner}
        lobbyId={lobbyId}
      />
    </>
  );
}
