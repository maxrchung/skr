// Reference: https://socket.io/get-started/chat

import { Server } from "socket.io";
import words from "./words/words.json" assert { type: "json" };

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

/* socket.data
{
  id,
  name,
  score,
  // Flag whether player scored for the round, used to determine if we need to skip
  hasScored  
}
*/

/* lobbies
{
  lobbyId: {
    lobbyId,
    lobbyName,
    password,
    timeOutId
  }
}
*/
const lobbies = {};
let lobbyId = 0;

const getOptions = () => {
  const options = [];
  for (let i = 0; i < 3; ++i) {
    options.push(words[Math.floor(Math.random() * words.length)]);
  }
  return options;
};

const getNextDrawerId = async (lobbyId, oldDrawerId) => {
  const sockets = await io.in(lobbyId).fetchSockets();
  const currIndex = sockets.findIndex((socket) => socket.id === oldDrawerId);

  let nextIndex;
  if (currIndex === -1 || currIndex === sockets.length - 1) {
    nextIndex = 0;
  } else {
    nextIndex = (currIndex + 1) % sockets.length;
  }
  const nextDrawerId = sockets[nextIndex].id;
  return nextDrawerId;
};

io.on("connection", (socket) => {
  console.log("Connected: " + socket.id);
  socket.data.id = socket.id; // for convenience

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.id);
  });

  socket.on("message", async (message) => {
    console.log("message", message);

    switch (message.type) {
      case "SET_NAME":
        socket.data.name = message.value;
        socket.emit("message", {
          type: "SET_NAME",
          value: socket.data.name,
        });
        break;

      case "SEE_LOBBY":
        socket.emit("message", {
          type: "SEE_LOBBY",
          lobbies: Object.values(lobbies),
        });
        break;

      case "NEW_LOBBY":
        lobbies[lobbyId] = {
          lobbyId,
          lobbyName: message.lobbyName,
          password: message.password,
        };

        socket.join(lobbyId);

        socket.emit("message", {
          type: "NEW_LOBBY",
          lobbyName: message.lobbyName,
          password: message.password,
          lobbies: Object.values(lobbies),
          playerList: [socket.data],
          lobbyId,
        });

        lobbyId++;
        break;

      case "JOIN_LOBBY": {
        const lobbyId = message.lobbyId;
        if (message.password === lobbies[lobbyId].password) {
          socket.join(lobbyId);

          const playerList = (await io.in(lobbyId).fetchSockets()).map(
            (socket) => socket.data
          );

          socket.emit("message", {
            type: "JOIN_LOBBY",
            playerList,
            lobbyName: lobbies[lobbyId].lobbyName,
            lobbyId,
          });

          io.to(lobbyId).emit("message", {
            type: "PLAYER_JOINED",
            playerList,
          });
        }
        break;
      }

      case "START_GAME":
        const options = getOptions();

        const sockets = await io.in(message.lobbyId).fetchSockets();
        const nextDrawerId =
          sockets[Math.floor(Math.random() * sockets.length)].id;

        (await io.in(message.lobbyId).fetchSockets()).forEach(
          (socket) => (socket.data.hasScored = false)
        );

        io.to(message.lobbyId).emit("message", {
          type: "START_GAME",
          drawerId: nextDrawerId,
          options,
        });
        break;

      case "GET_WORDS": {
        const options = getOptions();

        io.emit("message", {
          type: "GET_WORDS",
          options,
        });
        break;
      }

      case "MAKE_ME_DRAWER": {
        io.emit("message", {
          type: "MAKE_ME_DRAWER",
          drawerId: socket.id,
        });
        break;
      }

      case "CHOOSE_WORD":
        io.to(message.lobbyId).emit("message", {
          type: "CHOOSE_WORD",
          option: message.option,
          endTime: new Date().getTime() + 1000 * 60,
        });

        const timeoutId = setTimeout(async () => {
          const options = getOptions();

          const sockets = await io.in(message.lobbyId).fetchSockets();
          const currIndex = sockets.findIndex(
            (socket) => socket.id === message.drawerId
          );

          let nextIndex;
          if (currIndex === -1 || currIndex === sockets.length - 1) {
            nextIndex = 0;
          } else {
            nextIndex = (currIndex + 1) % sockets.length;
          }
          const nextDrawerId = sockets[nextIndex].id;

          (await io.in(message.lobbyId).fetchSockets()).forEach(
            (socket) => (socket.data.hasScored = false)
          );

          if (socket.data.score === 5) {
            sockets.forEach((socket) => (socket.data.score = 0));

            io.to(message.lobbyId).emit("message", {
              type: "END_GAME",
              winnerId: socket.id,
              playerList: (await io.in(lobbyId).fetchSockets()).map(
                (socket) => socket.data
              ),
            });
          } else {
            io.to(message.lobbyId).emit("message", {
              type: "RESET_ROUND",
              drawerId: nextDrawerId,
              options,
              playerList: (await io.in(lobbyId).fetchSockets()).map(
                (socket) => socket.data
              ),
            });
          }
        }, 1000 * 60);

        lobbies[message.lobbyId].timeoutId = timeoutId;
        break;

      case "GOT_ANSWER": {
        if (socket.data.score) {
          socket.data.score++;
        } else {
          socket.data.score = 1;
        }

        socket.data.hasScored = true;

        // if everyone has scored then go to next round
        const sockets = await io.in(message.lobbyId).fetchSockets();
        const notScored = sockets.filter((socket) => !socket.data.hasScored);

        // === 1 to ignore drawer
        if (notScored === 1) {
          const options = getOptions();
          const nextDrawerId = getNextDrawerId(
            message.lobbyId,
            message.drawerId
          );

          const sockets = await io.in(message.lobbyId).fetchSockets();
          sockets.forEach((socket) => (socket.data.hasScored = false));

          if (socket.data.score === 5) {
            sockets.forEach((socket) => (socket.data.score = 0));

            // Make sure we don't trigger timeout later
            clearTimeout(lobbies[message.lobbyId].timeoutId);

            io.to(message.lobbyId).emit("message", {
              type: "END_GAME",
              winnerId: socket.id,
              playerList: (await io.in(lobbyId).fetchSockets()).map(
                (socket) => socket.data
              ),
            });
          } else {
            io.to(message.lobbyId).emit("message", {
              type: "RESET_ROUND",
              drawerId: nextDrawerId,
              options,
              playerList: (await io.in(lobbyId).fetchSockets()).map(
                (socket) => socket.data
              ),
            });
          }
        } else {
          io.to(message.lobbyId).emit("message", {
            type: "GOT_ANSWER",
            answerId: socket.id,
            playerList: (await io.in(lobbyId).fetchSockets()).map(
              (socket) => socket.data
            ),
          });
        }

        break;
      }
      default:
        console.log("Unknown message", message);
    }
  });

  socket.on("draw", (message) => {
    // Conditional check so logs aren't slammed too hard
    if (message.type !== "DRAW" && message.type !== "CURSOR") {
      console.log("draw", message);
    }

    switch (message.type) {
      case "DRAW":
        io.emit("draw", message);
        break;

      case "CLEAR":
        io.emit("draw", message);
        break;

      case "CURSOR":
        io.emit("draw", message);
        break;

      default:
        console.log("Unknown draw", message);
    }
  });
});
