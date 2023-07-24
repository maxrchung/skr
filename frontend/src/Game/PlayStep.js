import { useState } from "react";
import Canvas from "../Canvas";
import { socket } from "../socket";

export default function PlayStep({ drawerId, gameWord, isCorrect, lobbyId }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  if (drawerId === socket.id) {
    return (
      <>
        <p className="draw-word-txt">
          Yo this is your word you need to draw: <strong>{gameWord}</strong>
        </p>
        <Canvas drawerId={drawerId} />
      </>
    );
  }

  return (
    <>
      {isCorrect ? (
        <h4>Nice. You got the answer. Good job.</h4>
      ) : (
        <>
          <p>Guess the word...</p>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <button
            onClick={() => {
              setValue("");

              if (value !== gameWord) {
                setError(true);
              } else {
                socket.emit("message", {
                  type: "GOT_ANSWER",
                  lobbyId,
                  drawerId,
                });
              }
            }}
          >
            Submit
          </button>
          {error && <h1>Wrong answer, try again</h1>}
        </>
      )}

      <Canvas drawerId={drawerId} />
    </>
  );
}
