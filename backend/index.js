// Reference: https://socket.io/get-started/chat

import { Server } from "socket.io";

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
        lobbies[lobbyId++] = {
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
        break;
      case "JOIN_LOBBY":
        let lobbyId = lobbies.filter((lobby) => {
          lobby.lobbyName === message.lobbyName;
        });

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
