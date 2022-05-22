const express = require("express");
const app = express();

const http = require("http");
const path = require("path");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const session = require("express-session");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const login = require("./Routes/login");
const homepage = require("./Routes/homepage");
const logout = require("./Routes/logout");
const { botName } = require("./config.json");
const bodyParser = require("body-parser");

require("dotenv").config();
require("./Database/db");
// require("./Socketio/socket");
require("ejs");

const { SECRET_KEY } = process.env;
const oneMonth = 1000 * 60 * 60 * 24 * 30;
const sessionObject = {
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: oneMonth,
  },
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessionObject));
app.use("/login", login);
app.use("/logout", logout);
app.use("/", homepage);

// app.use("/login", login);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "Public")));
app.use((req, res, next) => {
  console.info("I'm a middleware uWu", Date.now());
  next();
});
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    console.log("ServerSide: User: ", { username, room });
    // User Joined
    socket.join(user.room);
    io.to(user.room).emit("userJoined", {
      room: user.room,
      user,
    });

    // Welcome current user
    socket.emit(
      "message",
      formatMessage(botName, `${room} Odasına Hoşgeldiniz!`)
    );

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} sohbete katıldı.`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  const nowWriting = [];
  socket.on("isWriting", () => {
    const user = getCurrentUser(socket.id);
    if (!nowWriting.includes(user)) nowWriting.push(user);
    socket.broadcast
      .to(user.room)
      .emit("isWriting", formatMessage(user.username, "yazıyor..."));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} sohbetten çıktı.`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.info(`Server running on http://localhost:${PORT}`)
);
