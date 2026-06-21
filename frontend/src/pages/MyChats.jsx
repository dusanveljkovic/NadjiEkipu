import { useEffect, useState } from "react";
import ChatAvatar from "../components/ChatAvatar"
import { getUserChats } from "../services/chatService";
import { getRandomColor } from "../services/utils";

function ChatItem({ chat, onClick }) {
  const lastMessage = chat.last_message
  const { bg, color } = getRandomColor(chat.activity_title)

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors rounded-xl mx-2"
      style={{
        background: "transparent",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
    >
      <ChatAvatar
        initials={chat.activity_title.slice(0, 3).toUpperCase()}
        bg={bg}
        color={color}
        size={44}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="text-[14px] truncate"
              style={{
                fontWeight: lastMessage ? 600 : 500,
                color: "#1a1a18",
              }}
            >
              {chat.activity_title}
            </span>
          </div>
          {lastMessage && (
            <span
              className="text-[11px] flex-shrink-0"
              style={{ color: !lastMessage ? "#534AB7" : "#9ca3a0" }}
            >
              {lastMessage.sent_at.replace('T', ' ')}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span
            className="text-[12.5px] truncate"
            style={{
              color: !lastMessage ? "#1a1a18" : "#6b6b67",
              fontStyle: !lastMessage ? "italic" : "normal",
              fontWeight: lastMessage ? 500 : 400,
            }}
          >
            {!lastMessage ? "Nema poruka..." : lastMessage.message}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MyChats({ onSelectChat }) {
  const [chats, setChats] = useState([])

  useEffect(() => {
    getUserChats()
      .then((data) => {
        setChats(data)
      })
      .catch(() => { })
  }, [])

  // const totalUnread = chats.reduce((sum, c) => sum + c.unread, 0);
  const totalUnread = 0

  return (
    <div
      className="flex flex-col min-h-screen rounded-xl"
      style={{
        background: "#f5f5f3",
      }}
    >
      <div
        className="flex flex-col mx-auto w-full rounded-xl"
        style={{
          maxWidth: 480,
          minHeight: "100vh",
          background: "white",
          border: "0.5px solid rgba(0,0,0,0.08)",
          boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
        }}
      >
        <div className="px-5 pt-10 pb-3" style={{ borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-[22px]" style={{ fontWeight: 500, color: "#1a1a18" }}>Moje poruke</h1>
              {totalUnread > 0 && (
                <p className="text-[12px] mt-0.5" style={{ color: "#534AB7" }}>
                  {totalUnread} nepročitanih poruka
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {chats.map((chat) => (
            <ChatItem
              key={chat.chat_id}
              chat={chat}
              onClick={() => onSelectChat(chat.chat_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
