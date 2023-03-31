import  { useEffect } from 'react'

function useScrollOnMessage(messageRef, messages, data) {
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, [messageRef, data, messages]);
}

export default useScrollOnMessage