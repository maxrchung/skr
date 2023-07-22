// Reference: https://socket.io/get-started/chat

import { Server } from "socket.io";

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    //delete sockets[socket];
  });

  socket.on("message", (message) => {
    console.log(`Received: ${JSON.stringify(message)}`);

    switch (message.type) {
      case "SET_NAME":
        socket.data.username = message.value;
        socket.emit("message", {
          type: "SET_NAME",
          value: socket.data.username,
        });
        break;

      default:
        console.log("Unknown message");
    }
  });

  socket.on("draw", (data) => {
    io.emit("draw", data);
  });
});
