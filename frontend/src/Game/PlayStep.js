import Canvas from "../Canvas";
import { socket } from "../socket";

export default function PlayStep({ drawerId, gameWord }) {
  if (drawerId === socket.id) {
    return (
      <>
        <p>Yo this is your word you need to draw: {gameWord}</p>
        <Canvas drawerId={drawerId} />
      </>
    );
  } else {
    return (
      <>
        <p>Guess the word...</p>
        <input></input>
        <Canvas drawerId={drawerId} />
      </>
    );
  }
}
