import { useEffect, useState } from "react";
import ChooseStep from "./ChooseStep";
import PlayStep from "./PlayStep";

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
      {playerList.map((player) => (
        <div key={player.id}>
          {player.name}: {player.score || 0}
        </div>
      ))}
      {gameStep === "CHOOSE" ? (
        <ChooseStep
          drawerId={drawerId}
          options={options}
          playerList={playerList}
          lobbyId={lobbyId}
        />
      ) : (
        <>
          <p>
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
