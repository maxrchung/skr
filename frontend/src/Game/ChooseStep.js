import { socket } from "../socket";

export default function ChooseStep({ drawerId, options, playerList }) {
  if (drawerId === socket.id) {
    return (
      <>
        <p>Pick a word</p>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              socket.emit("message", {
                type: "CHOOSE_WORD",
                option,
                drawerId,
              });
            }}
          >
            {option}
          </button>
        ))}
      </>
    );
  } else {
    return (
      <p>
        {playerList.find((player) => player.id === drawerId).name} is currently
        picking...
      </p>
    );
  }
}
