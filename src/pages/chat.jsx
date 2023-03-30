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

function Chat({ sendMessage, allMessages, message, joinRoom }) {
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
  }, []);
  return (
    <main className="grid grid-cols-[200px_1fr]">
      {/* <h1>Chat</h1>
      <input type="text" value={input} onChange={onChangeHandler} />
      <button onClick={sendMessage}>send message</button>
      <div>
        {messages.map((msg, i) => {
          return <p key={i}>{msg}</p>;
        })}
      </div> */}
      <ChatSidebar />
      <ChatBox
        allMessages={allMessages}
        singleMessage={message}
        sendMessage={sendMessage}
      />
    </main>
  );
}

export default Chat;

function ChatSidebar() {
  return (
    <section className="bg-indigo-600 text-white h-screen">
      <h1>Chat Sidebar</h1>
    </section>
  );
}

function ChatBox({ messages = [], sendMessage, allMessages }) {
  const [input, setInput] = useState("");
  const onChangeHandler = (e) => {
    setInput(e.target.value);
  };

  function onSubmitHandler(e) {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  }
  return (
    <section className="0">
      {JSON.stringify(allMessages)}
      <div className="grid grid-rows-[1fr_auto] p-2.5 h-screen">
        <ul className=" py-5 space-y-3 overflow-y-auto">
          {allMessages.map((msg, i) => {
            return (
              <li className="block" key={i}>
                <div className="">
                  <span className="px-3 py-1 border rounded-xl">
                    {msg.message}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        <form onSubmit={onSubmitHandler} className="flex gap-2">
          <input
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="text"
            value={input}
            onChange={onChangeHandler}
          />
          <button className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            send
          </button>
        </form>
      </div>
    </section>
  );
}
