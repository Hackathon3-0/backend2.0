const Message = require("./model/Message");
require("dotenv").config();
require("./config/dbConnect");

const http = require("http");
const socketIo = require("socket.io");

const app = require("./app/app");

const PORT = process.env.PORT || 2020;
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const messageHistory = {}; // Odalara göre mesajları saklamak için bir nesne

io.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
    // Kullanıcı odalara katıldığında, geçmiş mesajları kontrol ederek onlara gönder
    if (messageHistory[room]) {
      messageHistory[room].forEach((message) => {
        socket.emit("chat message", message);
      });
    }
  });

  console.log("New client connected", socket.id);

  socket.on("chat message", (msg, room) => {
    if (room && io.sockets.adapter.rooms.get(room)) {
      // Eğer belirtilen bir oda varsa, sadece o odaya mesaj gönder
      io.to(room).emit("chat message", msg);
    } else {
      // Eğer belirtilen oda yoksa, yeni bir oda oluştur ve mesajı odaya gönder
      const newRoom =
        room || "generatedRoom_" + Math.random().toString(36).substring(7);
      socket.join(newRoom);
      if (!messageHistory[newRoom]) {
        messageHistory[newRoom] = []; // Yeni oda için mesaj geçmişini oluştur
      }
      messageHistory[newRoom].push(msg); // Mesajı geçmişe ekle
      io.to(newRoom).emit("chat message", msg);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
