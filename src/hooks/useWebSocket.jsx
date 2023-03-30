import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io from "Socket.IO-client";

const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // initialize socket
  useEffect(() => {
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
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.on("receive-message", (msg) => {
      console.log(msg, "message");
      setAllMessages((prev) => [...prev, msg]);
      setMessage(msg);
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

  function sendMessage(message) {
    if (!socket) return;
    socket.emit("send-message", {
      id: new Date(),
      message,
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

  return { socket, sendMessage, joinRoom, message, allMessages };
};

export default useWebSocket;
