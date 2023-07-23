import "./App.css";
import { useState } from "react";
import { socket } from "./socket";
import GamePhase from "./Game/GamePhase";

function App({
  name,
  lobbies,
  phase,
  lobbyName,
  password,
  playerList,
  options,
  drawerId,
  gameWord,
  gameStep,
  isCorrect,
  endTime,
  winner,
  lobbyId,
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
    return <Lobbies name={name} lobbies={lobbies}></Lobbies>;
  } else if (phase === "IN_LOBBY") {
    // render something else
    return (
      <LobbyView
        lobbyName={lobbyName}
        playerList={playerList}
        winner={winner}
        lobbyId={lobbyId}
      ></LobbyView>
    );
  } else if (phase === "GAME") {
    // render something else
    return (
      <GamePhase
        options={options}
        drawerId={drawerId}
        gameWord={gameWord}
        gameStep={gameStep}
        isCorrect={isCorrect}
        endTime={endTime}
        playerList={playerList}
        lobbyId={lobbyId}
      />
    );
  }
}

function NameInput() {
  const [value, setValue] = useState("");

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
  const [joinPassword, setJoinPassword] = useState("");

  return (
    <>
      {props.lobbies.map((lobby) => (
        <div key={lobby.lobbyId}>
          Lobby {lobby.lobbyName}{" "}
          <button
            onClick={(e) => {
              socket.emit("message", {
                type: "JOIN_LOBBY",
                lobbyId: lobby.lobbyId,
                password: joinPassword,
              });
            }}
          >
            Join Lobby
          </button>
          {lobby.password && (
            <>
              <label>Enter Password</label>
              <input
                value={joinPassword}
                onInput={(e) => {
                  setJoinPassword(e.target.value);
                }}
              ></input>
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

function LobbyView({ lobbyName, playerList, winner, lobbyId }) {
  return (
    <div>
      <h4>Welcome to lobby {lobbyName}!</h4>
      <br />
      {winner && (
        <p>
          <i>
            <b>{playerList.find((player) => player.id === winner).name}</b>
          </i>
          , you're winner!
        </p>
      )}
      <b>Player List</b>
      {playerList.map((player) => (
        <div key={player.id}>
          <label>{player.name}</label>
        </div>
      ))}
      <br></br>
      <button
        onClick={() => {
          socket.emit("message", { type: "START_GAME", lobbyId });
        }}
      >
        Start Game!!!!!!!!!!!!
      </button>
    </div>
  );
}

export default App;
