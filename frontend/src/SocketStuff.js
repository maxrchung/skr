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

  const [winner, setWinner] = useState([]);

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    function onMessage(message) {
      if (!process.env.NODE_ENV === "production") {
        console.log("message", message);
      }

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
          setLobbyId(message.lobby.lobbyId);
          setLobbyName(message.lobby.lobbyName);
          if (message.lobby.isPlaying) {
            setPhase("GAME");
            setGameStep("WAIT");
          } else {
            setPhase("IN_LOBBY");
          }
          setWinner([]);
          break;

        case "LEAVE_LOBBY":
          setPhase("OUT_LOBBY");
          setLobbies(message.lobbies);
          break;

        case "PLAYER_LIST_UPDATED":
          setPlayerList(message.playerList);
          break;

        case "START_GAME":
          setPhase("GAME");
          setIsCorrect(false);
          setDrawerId(message.drawerId);
          setOptions(message.options);
          setGameWord("");
          setGameStep("CHOOSE");
          setWinner([]);
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
          setGameStep("CHOOSE");
          setPlayerList(message.playerList);
          break;

        case "END_GAME":
          setPhase("IN_LOBBY");
          setWinner(message.winnerIds);
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
      <div className="top1">
        You are currently: {connected ? "Connected" : "Disconnected"}
      </div>
      <div className="top2">You are ID: {socket.id}</div>
      <div className="top3">You're name: {name}</div>

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
