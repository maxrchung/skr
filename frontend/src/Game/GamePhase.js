import { useEffect, useState } from "react";
import ChooseStep from "./ChooseStep";
import PlayStep from "./PlayStep";
import { socket } from "../socket";

export default function GamePhase({
  gameStep,
  drawerId,
  options,
  gameWord,
  isCorrect,
  endTime,
  playerList,
  lobbyId,
}) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((endTime - new Date().getTime()) / 1000);
      setRemaining(seconds);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [endTime]);

  return (
    <>
      <button
        className="quitter"
        onClick={() => socket.emit("message", { type: "LEAVE_LOBBY" })}
      >
        Leave the lobby...
      </button>

      <h2>First 5 points to win!!! Goo luckk!</h2>
      {playerList.map((player) => (
        <div className="player-scores" key={player.id}>
          {player.name}: {player.score || 0}
        </div>
      ))}
      {gameStep === "WAIT" ? (
        <p>Waiting for current round to end...</p>
      ) : gameStep === "CHOOSE" ? (
        <ChooseStep
          drawerId={drawerId}
          options={options}
          playerList={playerList}
          lobbyId={lobbyId}
          gameWord={gameWord}
        />
      ) : (
        <>
          <p className="timer">
            Time remaining: <strong>{remaining < 0 ? 0 : remaining}</strong>
          </p>
          <PlayStep
            drawerId={drawerId}
            gameWord={gameWord}
            isCorrect={isCorrect}
            lobbyId={lobbyId}
          />
        </>
      )}
    </>
  );
}
