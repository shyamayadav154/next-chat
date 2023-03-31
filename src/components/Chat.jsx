import Avatar from "@/components/Avatar";
import dayjs from "dayjs";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useScrollOnMessage from "@/hooks/useScrollOnMessage";
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
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  if (!roomData) return null;
  return (
    <section className="bg-indigo-600 text-white h-screen pb-2.5 space-y-1">
      <div className="pl-1 text-sm py-5 bg-indigo-900">
        <div className="text-xs font-medium text-indigo-200">Room</div>
        <div className="font-bold text-2xl">{roomData?.room}</div>
      </div>
      <article className="">
        <div className="pl-1 text-2xl font-bold">Users</div>
        <div>
          <ul className="space-y-1 text-sm flex flex-col-reverse">
            {roomData?.users?.map((user, i) => {
              return (
                <li
                  className={`py-1.5 font-medium  ${
                    user.name === name ? "bg-indigo-700 " : "text-indigo-200"
                  } mx-1 mt-1 rounded px-2`}
                  key={i}
                >
                  <Avatar name={user.name} />
                  <span className="ml-2 capitalize">
                    {user.name} {user.name === name && "(Me)"}{" "}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </article>
    </section>
  );
}

function sortByDate(a, b) {
    console.log(a,b,'so')
  return new Date(a.timestamp) - new Date(b.timestamp);
}
function ChatBox({ sendMessage, allMessages }) {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const [input, setInput] = useState("");
  const messageRef = useRef(null)
  useScrollOnMessage(messageRef, allMessages)
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
      <div className="grid grid-rows-[1fr_auto] p-2.5 bg-slate-50 h-screen">
        <ul ref={messageRef} className=" py-5 overflow-y-auto justify-end flex flex-col gap-2.5">
          {allMessages?.sort(sortByDate).map((msg, i) => (
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
    <li>
      <div
        className={`flex gap-1 ${msg.name === name ? "" : "flex-row-reverse"}`}
      >
        <motion.div
          style={{
            originX: msg.name === name ? "1" : "0",
          }}
          className={`border rounded-lg ${
            msg.name === name
              ? "ml-auto bg-slate-100"
              : msg.name === "admin"
              ? "mx-auto bg-indigo-100"
              : "mr-auto border "
          } `}
          layout
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.8,
          }}
          transition={{
            opacity: {
              duration: 0.2,
            },
            layout: {
              type: "spring",
              bounce: 0.4,
            },
          }}
        >
          <div className="pl-4 pt-2 pr-10 pb-6  relative text-sm">
            <span>{msg.message}</span>
            <span className="absolute bottom-1 right-2 text-gray-400 font-medium text-xs">
              {dayjs(msg.timestamp).format("hh:mm a")}
            </span>
          </div>
        </motion.div>
        <AnimatePresence>
          {msg.name !== "admin" && (
            <motion.span
              layout
              initial={{ opacity: 0,y:10 }}
              animate={{ opacity: 1,y:0 }}
            >
              <Avatar name={msg.name} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
}