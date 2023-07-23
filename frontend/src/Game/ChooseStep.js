import { socket } from "../socket";

export default function ChooseStep({ drawerId, options }) {
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
              });
            }}
          >
            {option}
          </button>
        ))}
      </>
    );
  } else {
    return <p>{drawerId} is currently picking...</p>;
  }
}
