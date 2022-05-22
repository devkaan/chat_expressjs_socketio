const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const username = document.getElementsByClassName("username")[0].textContent;
const room = roomName.textContent;

const socket = io();

// Add room name to DOM
const outputRoomName = (room) => {
  roomName.innerText = room ? room : "";
};
// Output message to DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += `<span>&nbsp;${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
};

// Add users to DOM
const outputUsers = (users) => {
  userList.innerHTML = "";
  console.log(users);
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
};

// Join chatroom
console.log("Main.js", { username, room });
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
  document.querySelector(".user-count").textContent = users.length;
});

// IsWriting
socket.on("isWriting", (data) => {
  console.log(data);
  const isWriting = document.querySelector(".isWriting");
  isWriting.textContent = data.username + data.text;
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  // document.querySelector(".chat-container").style.height = window.innerHeight;
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Is writing... text
const msg = document.querySelector("#msg");
if (msg) {
  msg.addEventListener("keypress", () => {
    socket.emit("isWriting");
  });
}

// Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "/logout";
  }
});
