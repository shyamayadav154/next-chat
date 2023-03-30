import FormInput from "@/components/FormInput";
import useWebSocket from "@/hooks/useWebSocket";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";


import Chat from "./chat";

export default function Home() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const room = searchParams.get("room");
  const { sendMessage, joinRoom, allMessages, roomMessages,roomData } = useWebSocket();

  // console.log({ name, room });

  if (!name || !room) {
    return <JoinRoomForm />;
  }

  return (
    <Chat
      sendMessage={sendMessage}
      joinRoom={joinRoom}
      roomMessages={roomMessages}
      allMessages={allMessages}
      roomData={roomData}
    />
  );
}

function JoinRoomForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  function onSubmitHandler(e) {
    e.preventDefault();
    if (!name) return alert("Please enter a name");
    if (!room) return alert("Please enter a room");
    // joinRoom(name,room)
    router.push(`/?name=${name}&room=${room}`, undefined, { shallow: true });
  }

  return (
    <main className="h-screen  bg-slate-900  w-screen grid place-content-center">
      <section className="border-2 w-[350px] rounded-xl bg-slate-100 p-5">
        <h1 className="font-bold text-3xl ">Join</h1>
        <article className="mt-5  space-y-2.5">
          <FormInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Display name"
          />
          <FormInput
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            label="Room"
          />
        </article>
        <button
          onClick={onSubmitHandler}
          className="bg-indigo-600 hover:bg-indigo-700 mt-6 font-medium  text-slate-100 w-full py-1.5 rounded-md"
        >
          Join
        </button>
      </section>
    </main>
  );
}
