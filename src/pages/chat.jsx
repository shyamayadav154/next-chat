import Avatar from "@/components/Avatar";
import dayjs from "dayjs";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// const useJoinRoom = (name, room) => {
//   const { socket } = useWebSocket();
//   const router = useRouter();
//   useEffect(() => {
//     if(!socket) return;
//     if (!room || !name) {
//      return router.push("/");
//     }
//     socket.emit("join-room", { name, room });
//   }, [name, room,socket]);
// };

function Chat({ sendMessage, allMessages, joinRoom, roomData }) {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const room = searchParams.get("room");

  const hasMounted = useRef(null);
  //   useJoinRoom(room, name);

  //   const { socket } = useWebSocket();
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      joinRoom(name, room);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
    <Head>
        <title>Chat</title>
    </Head>

    <main className="grid grid-cols-[200px_1fr]">
      <ChatSidebar roomData={roomData} />
      <ChatBox allMessages={allMessages} sendMessage={sendMessage} />
    </main>
    </>
  );
}

export default Chat;

function ChatSidebar({ roomData }) {
  if (!roomData) return null;
  return (
    <section className="bg-indigo-600 text-white h-screen py-2.5 space-y-1">
      <div className="pl-1 text-sm">
        You are in room <span className="font-bold">{roomData?.room}</span>
      </div>
      <article className="">
        <div className="pl-1 text-sm">User(s) present in room:</div>
        <div>
          <ul className="space-y-1 ">
            {roomData?.users?.map((user, i) => {
              return (
                <li className="py-1.5 bg-indigo-500 mx-1 mt-1 rounded px-2" key={i}>
                  <Avatar name={user.name} />
                  <span className="ml-2">{user.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </article>
    </section>
  );
}

function ChatBox({ sendMessage, allMessages }) {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const [input, setInput] = useState("");
  const onChangeHandler = (e) => {
    setInput(e.target.value);
  };

  function onSubmitHandler(e) {
    e.preventDefault();
    sendMessage(input, name);
    setInput("");
  }
  return (
    <section className="">
      {/* {JSON.stringify(allMessages)} */}
      <div className="grid grid-rows-[1fr_auto] p-2.5 h-screen">
        <ul className=" py-5 space-y-4 overflow-y-auto">
          {allMessages?.map((msg, i) => (
            <SingleMessage name={name} msg={msg} key={i} />
          ))}
        </ul>
        <form onSubmit={onSubmitHandler} className="flex gap-2">
          <input
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="text"
            value={input}
            onChange={onChangeHandler}
          />
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Send
          </button>
        </form>
      </div>
    </section>
  );
}

function SingleMessage({ msg, name }) {
  return (
    <li className="">
      <div
        className={`flex gap-1 ${msg.name === name ? "" : "flex-row-reverse"}`}
      >
        <div
          className={`border rounded-lg ${
            msg.name === name
              ? "ml-auto bg-slate-100"
              : msg.name === "admin"
              ? "mx-auto bg-indigo-100"
              : "mr-auto border "
          } `}
        >
          <div className="pl-4 pt-2 pr-10 pb-6  relative text-sm">
            <span>{msg.message}</span>
            <span className="absolute bottom-1 right-2 text-gray-400 font-medium text-xs">
              {dayjs(msg.timestamp).format("hh:mm a")}
            </span>
          </div>
        </div>
        {msg.name !== "admin" && <Avatar name={msg.name} />}
      </div>
    </li>
  );
}
