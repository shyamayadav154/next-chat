import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [roomMessages, setRoomMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomData, setRoomData] = useState([]);
  const router = useRouter();

  // initialize socket
  useEffect(() => {
    if(socket) return;
    socketInitializer();
    return () => {
        if(socket) socket.disconnect();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // socket events inside
  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("message", (msg) => {
      console.log(msg);
      setRoomMessages((prev) => [...prev, msg]);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.on("receive-message", (msg) => {
      console.log(msg, "message");
      setAllMessages((prev) => [...prev, msg]);
      setMessage(msg);
    });

    socket.on("room-data", (roomData) => {
        console.log(roomData, "room Data");
        setRoomData(roomData);
    });

  

    
    
    return () => {
        socket.disconnect();
    };
  }, [socket]);
  

  const socketInitializer = async () => {
    await fetch("/api/socket");
    // socket = io();
    setSocket(io());
  };

  

    function uploadImage(data) {
        if (!socket) return;
        console.log('belore file')
        if(!data?.file) return;
        console.log('after file',data)
        socket.emit("upload-image", data);
      }

  function sendMessage(message,name,file) {
    if (!socket) return;
    console.log('send message',message,name,file)
    socket.emit("send-message", {
      id: new Date(),
      message,
      name,
      file,
      timestamp: new Date(),
    });
  }
  let count = 0;
  const joinRoom = (name, room) => {
    console.log(count++);
    if (!socket) return;

    socket.emit("join-room", { name, room }, (error) => {
      if (error) {
        alert(error);
      router.push('/')
      }
      return true
    });
    
  };

  return { socket, sendMessage,uploadImage, joinRoom, message, allMessages,roomMessages,roomData };
};

export default useWebSocket;
