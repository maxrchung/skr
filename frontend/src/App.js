import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

const lobbies = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
];

function App() {
  const [name, setName] = useState(undefined);
  const [phase, setPhase] = useState("NAME_PHASE");

  if (phase === "NAME") {
    // render something
  } else if (phase === "IN_LOBBY") {
    // render something else
  } else if (phase === "GAME") {
    // render something else
  }

  if (!name) {
    return (
      <div>
        <p>hey you need to enter a name broski</p>
        <Input name={name} setName={setName} />
      </div>
    );
  } else {
    return <Lobbies></Lobbies>;
  }
}

function Input(props) {
  return (
    <input
      value={props.name}
      onInput={(event) => {
        props.setName(event.target.value);
      }}
    ></input>
  );
}

function Lobbies(props) {
  console.log("props", props);
  return lobbies.map((lobby) => (
    <div key={lobby.id}>This is my lobby: {lobby.id}</div>
  ));
}

export default App;
