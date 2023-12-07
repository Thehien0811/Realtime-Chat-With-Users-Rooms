const express = require("express");
const http = require("http");
const path = require("path");
const PORT = 3000;
const app = express();
const server = http.createServer(app);
const sc = require("socket.io");
const io = sc(server);
const formatMessage = require("./utils/message");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");
const botName = "Chat Bot";

io.on("connection", (socket) => {
  socket.on("joinroom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room)
    socket.join(user.room);

    // welcome
    socket.emit("message", formatMessage(botName, "Welcome to chat"));
    socket.broadcast.to(user.room).emit(
      "message",
      formatMessage(botName, `${user.username} has join the chat`)
    );
    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
  // Disconnected
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });

  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit("message", formatMessage(user.username, message))
  });
});

app.use(express.static(path.join(__dirname, "public")));
server.listen(3000, () =>
  console.log(`server is running on http://localhost:${PORT}`)
);
