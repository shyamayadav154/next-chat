import { addUser, getUser, getUsersInRoom, removeUser } from "@/utils/user";
import nc from "next-connect";
import { Server } from "socket.io";
import cors from "cors";

const handler = nc({
  onError: (err, req, res, _next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  .use(cors())
  .get((req, res) => {
    if (res.socket.server.io) {
      console.log("Already set up");
      res.end();
      return;
    }

    //create server with maxhttpbuffer size of 5mb
    const io = new Server(res.socket.server, {
      maxHttpBufferSize: 5e6,
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("join-room", ({ name, room }, callback) => {
        const { user, error } = addUser({ id: socket.id, name, room });

        if (error) {
          return callback(error);
        }
        socket.join(user.room);


        socket.broadcast.to(user.room).emit("receive-message", {
          id: socket.id,
          name: "admin",
          message: `${user.name} has joined the room`,
        });

        io.to(user.room).emit("room-data", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });

        callback();
      });

      socket.on("send-message", (msg) => {
        const user = getUser(socket.id);
        console.log("Received message", msg);
        io.to(user.room).emit("receive-message", msg);
      });

      socket.on('upload-image',data=>{
        const user = getUser(socket.id);
        console.log('Received image', data);
        io.to(user.room).emit('receive-message', data);
      })

    


      socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
          io.to(user.room).emit("receive-message", {
            message: `${user.name} has left the room`,
            name: "admin",
            
          });
            io.to(user.room).emit("room-data", {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
        }
        console.log("User has left");
      });
    });

    console.log("Setting up socket");
    res.end();
  });

export default handler;
