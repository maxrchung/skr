// Reference: https://socket.io/get-started/chat

import { Server } from "socket.io";
import words from "./words/words.json" assert { type: "json" };

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const lobbies = {};

let lobbyId = 0;

io.on("connection", (socket) => {
  console.log("Connected: " + socket.id);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.id);
  });

  socket.on("message", (message) => {
    console.log("message", message);

    switch (message.type) {
      case "SET_NAME":
        socket.data.username = message.value;
        socket.emit("message", {
          type: "SET_NAME",
          value: socket.data.username,
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
          players: [{ id: socket.id, name: socket.data.username }],
          lobbyName: message.lobbyName,
          password: message.password,
        };
        socket.emit("message", {
          type: "NEW_LOBBY",
          lobbyName: message.lobbyName,
          password: message.password,
          lobbies: Object.values(lobbies),
          players: lobbies[lobbyId].players,
        });
        lobbyId++;
        break;
      case "JOIN_LOBBY": {
        let lobbyId;
        Object.keys(lobbies).forEach((i) => {
          if (lobbies[i].lobbyName === message.lobbyName) {
            lobbyId = i;
          }
        });
        if (message.password === lobbies[lobbyId].password) {
          lobbies[lobbyId].players.push({
            id: socket.id,
            name: socket.data.username,
          });
          socket.emit("message", {
            type: "JOIN_LOBBY",
            playerList: lobbies[lobbyId].players,
            lobbyName: lobbies[lobbyId].lobbyName,
          });
        }
        io.emit("message", {
          type: "PLAYER_JOINED",
          playerList: lobbies[lobbyId].players,
        });
        break;
      }

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
        io.emit("message", {
          type: "CHOOSE_WORD",
          option: message.option,
          endTime: new Date().getTime() + 1000 * 60,
        });

        setTimeout(async () => {
          const options = [];
          for (let i = 0; i < 3; ++i) {
            options.push(words[Math.floor(Math.random() * words.length)]);
          }

          // TODO: Get sockets in room
          const sockets = await io.fetchSockets();
          const ids = sockets.map((socket) => socket.id);
          const index = ids.findIndex((id) => id === message.drawerId);

          let nextIndex;
          if (index === -1 || index === ids.length - 1) {
            nextIndex = 0;
          } else {
            nextIndex = (index + 1) % ids.length;
          }
          const nextDrawer = ids[nextIndex];

          io.emit("message", {
            type: "RESET_ROUND",
            drawerId: nextDrawer,
            options,
          });
        }, 1000 * 60);
        break;

      case "GOT_ANSWER":
        // TODO: Update scores or something
        io.emit("message", { type: "GOT_ANSWER" });
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
