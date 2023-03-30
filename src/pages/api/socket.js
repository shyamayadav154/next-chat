import { addUser, getUser, removeUser } from "@/utils/user";
import nc from "next-connect";
import { Server } from "socket.io";

const handler = nc({
  onError: (err, req, res, _next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
}).get((req, res) => {
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("join-room", ({ name, room }, callback) => {
      const { user, error } = addUser({ id: socket.id, name, room });

      if (error) {
        return callback(error);
      }
      socket.join(user.room);

      socket.emit("message", {
        user: name,
        message: `${name} has joined the room for all`,
      });

      socket.broadcast.to(user.room).emit("message", {
        user: name,
        message: `${user.name} has joined the room from broadcast`,
      });

      callback();
    });

    socket.on("send-message", (obj) => {
        const  user = getUser(socket.id)
      console.log("Received message", obj);
      io.to(user.room).emit("receive-message", obj);
    });

    socket.on("disconnect", () => {
      const  user  = removeUser(socket.id);
      if(user){
        io.to(user.room).emit("message", {
            message: `${user.name} has left the room`,
            });
      }
      console.log("User has left");
    });
  });

  console.log("Setting up socket");
  res.end();
});

export default handler;
