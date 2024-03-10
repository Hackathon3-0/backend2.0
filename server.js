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

io.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
    Message.find({ room }, (err, messages) => {
      if (err) {
        console.error("Mesajlar alınırken bir hata oluştu:", err);
      } else {
        messages.forEach((message) => {
          socket.emit("chat message", message.message);
        });
      }
    });
  });

  console.log("New client connected", socket.id);

  socket.on("chat message", (msg, room, sender) => {
    if (room && io.sockets.adapter.rooms.get(room)) {
      const newMessage = new Message({ room, sender, message: msg });
      newMessage.save((err) => {
        if (err) {
          console.error("Mesaj kaydedilirken bir hata oluştu:", err);
        }
      });
      io.to(room).emit("chat message", msg);
    } else {
      const newRoom =
        room || "generatedRoom_" + Math.random().toString(36).substring(7);
      socket.join(newRoom);
      const newMessage = new Message({ room: newRoom, sender, message: msg });
      newMessage.save((err) => {
        if (err) {
          console.error("Mesaj kaydedilirken bir hata oluştu:", err);
        }
      });
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
