import { useEffect, useRef, useState } from "react";
import Canvas from "../Canvas";
import { socket } from "../socket";

const alphaNum = /^[a-z0-9]+$/i;

export default function PlayStep({ drawerId, gameWord, isCorrect, lobbyId }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const [hintIndex1, setHintIndex1] = useState(-1);
  const [hintIndex2, setHintIndex2] = useState(-1);
  const [hintIndex3, setHintIndex3] = useState(-1);
  const [hintIndex4, setHintIndex4] = useState(-1);
  const [hintIndex5, setHintIndex5] = useState(-1);
  const [hintIndex6, setHintIndex6] = useState(-1);
  const [hintIndex7, setHintIndex7] = useState(-1);

  // yolo
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (1 <= gameWord.length / 2) {
        setHintIndex1(Math.floor(Math.random() * gameWord.length));
      }
    }, 10 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [gameWord.length]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (2 <= gameWord.length / 2) {
        setHintIndex2(Math.floor(Math.random() * gameWord.length));
      }
    }, 20 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [gameWord.length]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (3 <= gameWord.length / 2) {
        setHintIndex3(Math.floor(Math.random() * gameWord.length));
      }
    }, 30 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [gameWord.length]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (4 <= gameWord.length / 2) {
        setHintIndex4(Math.floor(Math.random() * gameWord.length));
      }
    }, 40 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [gameWord.length]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (5 <= gameWord.length / 2) {
        setHintIndex5(Math.floor(Math.random() * gameWord.length));
      }
    }, 45 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [gameWord.length]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (6 <= gameWord.length / 2) {
        setHintIndex6(Math.floor(Math.random() * gameWord.length));
      }
    }, 50 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [gameWord.length]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (7 <= gameWord.length / 2) {
        setHintIndex7(Math.floor(Math.random() * gameWord.length));
      }
    }, 55 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [gameWord.length]);

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

  let hint = [];
  for (let i = 0; i < gameWord.length; ++i) {
    const char = gameWord[i];
    if (
      char.match(alphaNum) &&
      i !== hintIndex1 &&
      i !== hintIndex2 &&
      i !== hintIndex3 &&
      i !== hintIndex4 &&
      i !== hintIndex5 &&
      i !== hintIndex6 &&
      i !== hintIndex7
    ) {
      hint.push("_");
    } else {
      hint.push(char);
    }
  }

  return (
    <>
      {isCorrect ? (
        <h4>Nice. You got the answer. Good job.</h4>
      ) : (
        <div className="submit-btn">
          <p>Guess the word...</p>
          <p>
            {hint.map((char, index) => (
              <span key={index} className="hint">
                {char}
              </span>
            ))}
          </p>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <button
            onClick={() => {
              setValue("");

              const laxGameWord = gameWord.replace(/[^a-z0-9]/gi, "");
              const laxValue = value.replace(/[^a-z0-9]/gi, "");
              const isMatch = laxGameWord === laxValue;

              if (!isMatch) {
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
        </div>
      )}

      <Canvas drawerId={drawerId} />
    </>
  );
}
