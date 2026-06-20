import { useState } from "react";
import MyChats from "./MyChats";
import ChatPage from "./SingleChat";

export default function Chats() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  console.log(selectedChatId)
  const handleSelectChat = (id) => {
    setSelectedChatId(id)
  }

  return (
    <div>
      {
        selectedChatId ? (
          <ChatPage chatId={selectedChatId} onBack={() => setSelectedChatId(null)} />
        ) : (
          <MyChats onSelectChat={setSelectedChatId} />
        )
      }
    </div>
  )
}
