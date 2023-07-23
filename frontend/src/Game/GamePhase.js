import { socket } from "../socket";
import ChooseStep from "./ChooseStep";
import PlayStep from "./PlayStep";

export default function GamePhase({ gameStep, drawerId, options, gameWord }) {
  if (gameStep === "CHOOSE") {
    return <ChooseStep drawerId={drawerId} options={options} />;
  } else if (gameStep === "PLAY") {
    return <PlayStep drawerId={drawerId} gameWord={gameWord} />;
  }
}
