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
}) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = (endTime - new Date().getTime()) / 1000;
      setRemaining(seconds);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [endTime]);

  if (gameStep === "CHOOSE") {
    return <ChooseStep drawerId={drawerId} options={options} />;
  } else if (gameStep === "PLAY") {
    return (
      <>
        <p>
          Time remaining: <strong>{remaining < 0 ? 0 : remaining}</strong>
        </p>
        <PlayStep
          drawerId={drawerId}
          gameWord={gameWord}
          isCorrect={isCorrect}
        />
      </>
    );
  }
}
