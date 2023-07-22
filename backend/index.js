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
    delete sockets[socket];
  });

  socket.on("message", (message) => {
    console.log(`Received: ${message}`);
  });
});
