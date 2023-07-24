import "./App.css";
import { useEffect, useState } from "react";
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
        <h1 className="SKR">SKR</h1>
        <p className="hellosu">hey you need to enter a name broski</p>
        <NameInput />
        <p className="我很喜歡冰淇淋">我很喜歡冰淇淋</p>
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
        className="name-button"
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

  // Load lobbies when this component initially loads
  useEffect(() => {
    socket.emit("message", { type: "SEE_LOBBY" });
  }, []);

  return (
    <>
      {props.lobbies.map((lobby) => (
        <LobbyEntry lobby={lobby} key={lobby.lobbyId} />
      ))}
      New lobby name:{" "}
      <input
        value={newLobbyName}
        onInput={(e) => setNewLobbyName(e.target.value)}
      />
      New lobby password:{" "}
      <input
        value={newLobbyPassword}
        onInput={(e) => setNewLobbyPassword(e.target.value)}
      />
      <button
        onClick={() => {
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

function LobbyEntry({ lobby }) {
  const [password, setPassword] = useState("");
  return (
    <div className="lobbys" key={lobby.lobbyId}>
      Lobby {lobby.lobbyName}{" "}
      <button
        onClick={(e) => {
          socket.emit("message", {
            type: "JOIN_LOBBY",
            lobbyId: lobby.lobbyId,
            password,
          });
        }}
      >
        Join Lobby
      </button>
      {lobby.password && (
        <>
          <label>Enter Password</label>
          <input
            value={password}
            onInput={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </>
      )}
    </div>
  );
}

function LobbyView({ lobbyName, playerList, winner, lobbyId }) {
  return (
    <div>
      <h4 className="lobby-welcome">Welcome to lobby {lobbyName}!</h4>
      <br />
      {winner.length > 0 && (
        <div className="weiner">
          <h2>WINNERS!!!! YOU WON GOOD JOBYOU WON GOOD JOBYOU WON GOOD JOB</h2>
          {winner.map((id) => (
            <i key={id}>
              <b className="weiners">
                {playerList.find((player) => player.id === id).name}
              </b>
            </i>
          ))}
        </div>
      )}
      <b className="player-list-txt">Player List</b>
      {playerList.map((player) => (
        <div key={player.id}>
          <label className="players">{player.name}</label>
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
