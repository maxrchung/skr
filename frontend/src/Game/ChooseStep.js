import { socket } from "../socket";

export default function ChooseStep({ drawerId, options, playerList, lobbyId }) {
  if (drawerId === socket.id) {
    return (
      <>
        <p className="word-pick">Pick a word</p>
        {options.map((option, index) => (
          <div key={index}>
            <button
              className="word-button"
              key={option}
              onClick={() => {
                socket.emit("message", {
                  type: "CHOOSE_WORD",
                  option,
                  drawerId,
                  lobbyId,
                });
              }}
            >
              {option}
            </button>
          </div>
        ))}
      </>
    );
  } else {
    return (
      <p className="picking-name-txt">
        {playerList.find((player) => player.id === drawerId)?.name} is currently
        picking...
      </p>
    );
  }
}
