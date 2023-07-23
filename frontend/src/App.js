import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { socket } from "./socket";
import GamePhase from "./Game/GamePhase";

function App({
  username,
  lobbies,
  phase,
  options,
  drawerId,
  gameWord,
  gameStep,
}) {
  if (phase === "NAME_PHASE") {
    // render something
    return (
      <div className="skr-name">
        <p>hey you need to enter a name broski</p>
        <NameInput />
      </div>
    );
  } else if (phase === "OUT_LOBBY") {
    // render something else
    return <Lobbies name={username} lobbies={lobbies}></Lobbies>;
  } else if (phase === "IN_LOBBY") {
    // render something else
    return <LobbyView></LobbyView>;
  } else if (phase === "GAME") {
    // render something else
    console.log(phase);
    return (
      <GamePhase
        options={options}
        drawerId={drawerId}
        gameWord={gameWord}
        gameStep={gameStep}
      />
    );
  }
}

function NameInput() {
  const [value, setValue] = useState(undefined);

  return (
    <>
      <input
        value={value}
        onInput={(event) => {
          setValue(event.target.value);
        }}
      />
      <button
        onClick={(e) => {
          socket.emit("message", { type: "SET_NAME", value });
        }}
      >
        Ok
      </button>
    </>
  );
}

function Lobbies(props) {
  const [newLobbyName, setNewLobbyName] = useState("");
  const [newLobbyPassword, setNewLobbyPassword] = useState("");

  console.log("props", props);
  console.log("lobbies", props.lobbies);
  return (
    <>
      <div>You're Username: {props.name}</div>
      {props.lobbies.map((lobby) => (
        <div key={lobby.lobbyName}>
          Lobby {lobby.lobbyName}{" "}
          <button onClick={(e) => {}}>Join Lobby</button>
          {lobby.password && (
            <>
              <label>Enter Password</label>
              <input></input>
            </>
          )}
        </div>
      ))}
      New lobby name:{" "}
      <input
        value={newLobbyName}
        onInput={(e) => {
          setNewLobbyName(e.target.value);
        }}
      ></input>
      New lobby password:{" "}
      <input
        value={newLobbyPassword}
        onInput={(e) => {
          setNewLobbyPassword(e.target.value);
        }}
      ></input>
      <button
        onClick={(e) => {
          socket.emit("message", {
            type: "NEW_LOBBY",
            lobbyName: newLobbyName,
            password: newLobbyPassword,
          });
          // props.setLobbies(
          //   props.lobbies.concat({
          //     lobbyname: newLobbyName,
          //     password: newLobbyPassword,
          //   })
          // );
        }}
      >
        Create Lobby!
      </button>
      <div>
        <button
          onClick={(e) => {
            socket.emit("message", { type: "SEE_LOBBY" });
          }}
        >
          See Lobbies
        </button>
      </div>
    </>
  );
}

function LobbyView() {
  return (
    <>
      <label>727Reggin</label>
    </>
  );
}

export default App;
