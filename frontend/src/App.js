import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [phase, setPhase] = useState("NAME_PHASE");
  const [lobbies, setLobbies] = useState([]);

  if (phase === "NAME_PHASE") {
    // render something
    return (
      <div className="skr-name">
        <p>hey you need to enter a name broski</p>
        <NameInput name={name} setName={setName} setPhase={setPhase} />
      </div>
    );
  } else if (phase === "OUT_LOBBY") {
    // render something else
    return (
      <Lobbies name={name} lobbies={lobbies} setLobbies={setLobbies}></Lobbies>
    );
  } else if (phase === "IN_LOBBY") {
    // render something else
  } else if (phase === "GAME") {
    // render something else
  }
}

function NameInput(props) {
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
          props.setName(value);
          props.setPhase("OUT_LOBBY");
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
  return (
    <>
      <div>You're Username: {props.name}</div>
      {props.lobbies.map((lobby) => (
        <div key={lobby.lobbyname}>
          Lobby {lobby.lobbyname}{" "}
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
          props.setLobbies(
            props.lobbies.concat({
              lobbyname: newLobbyName,
              password: newLobbyPassword,
            })
          );
        }}
      >
        Create Lobby!
      </button>
    </>
  );
}

export default App;
