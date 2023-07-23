// Reference: https://socket.io/get-started/chat

import { Server } from "socket.io";
import words from "./words/words.json" assert { type: "json" };

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

/* 
{
	lobbyName,
  password,
  timeOutId
}*/
const lobbies = {};

let lobbyId = 0;

io.on("connection", (socket) => {
  console.log("Connected: " + socket.id);
  socket.data.id = socket.id;

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
        const options = [];
        for (let i = 0; i < 3; ++i) {
          options.push(words[Math.floor(Math.random() * words.length)]);
        }

        const sockets = await io.in(message.lobbyId).fetchSockets();
        const nextDrawer =
          sockets[Math.floor(Math.random() * sockets.length)].id;

        io.to(message.lobbyId).emit("message", {
          type: "START_GAME",
          drawerId: nextDrawer,
          options,
        });
        break;

      case "GET_WORDS": {
        const options = [];
        for (let i = 0; i < 3; ++i) {
          options.push(words[Math.floor(Math.random() * words.length)]);
        }

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
          const options = [];
          for (let i = 0; i < 3; ++i) {
            options.push(words[Math.floor(Math.random() * words.length)]);
          }

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
          const nextDrawer = sockets[nextIndex].id;

          io.to(message.lobbyId).emit("message", {
            type: "RESET_ROUND",
            drawerId: nextDrawer,
            options,
          });
        }, 1000 * 60);

        lobbies[message.lobbyId].timeoutId = timeoutId;
        break;

      case "GOT_ANSWER":
        // TODO: Update scores or something
        if (socket.data.score) {
          socket.data.score++;
        } else {
          socket.data.score = 1;
        }
        if (socket.data.score === 5) {
          const sockets = await io.fetchSockets();
          sockets.forEach((socket) => {
            socket.data.score = 0;
          });

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
            type: "GOT_ANSWER",
            playerList: (await io.in(lobbyId).fetchSockets()).map(
              (socket) => socket.data
            ),
          });
        }
        break;

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
