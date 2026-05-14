import { useState } from "react";
import ChatAvatar from "../components/ChatAvatar"

const chats = [
  {
    id: 1,
    name: "Basket",
    initials: "BA",
    bg: "#EEEDFE",
    color: "#534AB7",
    lastMessage: "Tigar: JA SAM NAJJACI",
    time: "10:12 AM",
    unread: 4,
  },
  {
    id: 2,
    name: "Fudbal",
    initials: "FU",
    bg: "#FCEBEB",
    color: "#A32D2D",
    lastMessage: null,
    time: null,
    unread: 0,
  },
  {
    id: 3,
    name: "Ucenje",
    initials: "UC",
    bg: "#EEEDFE",
    color: "#538AB7",
    lastMessage: "Jana: os mi je omiljeni predmet!",
    time: "10:12 AM",
    unread: 99,
  },
];

function ChatItem({ chat, active, onClick }) {
  const hasUnread = chat.unread > 0;
  const noMessages = !chat.lastMessage;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors rounded-xl mx-2"
      style={{
        background: active ? "rgba(83,74,183,0.08)" : "transparent",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <ChatAvatar
        initials={chat.initials}
        bg={chat.bg}
        color={chat.color}
        size={44}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="text-[14px] truncate"
              style={{
                fontWeight: hasUnread ? 600 : 500,
                color: "#1a1a18",
              }}
            >
              {chat.name}
            </span>
          </div>
          {chat.time && (
            <span
              className="text-[11px] flex-shrink-0"
              style={{ color: hasUnread ? "#534AB7" : "#9ca3a0" }}
            >
              {chat.time}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span
            className="text-[12.5px] truncate"
            style={{
              color: noMessages ? "#9ca3a0" : hasUnread ? "#1a1a18" : "#6b6b67",
              fontStyle: noMessages ? "italic" : "normal",
              fontWeight: hasUnread ? 500 : 400,
            }}
          >
            {noMessages ? "Nema poruka..." : chat.lastMessage}
          </span>

          {hasUnread && (
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-[11px] font-medium"
              style={{
                background: "#534AB7",
                minWidth: chat.unread > 9 ? 22 : 18,
                height: 18,
                padding: "0 5px",
              }}
            >
              {chat.unread > 99 ? "99+" : chat.unread}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyChats() {
  const [activeId, setActiveId] = useState(null);

  const totalUnread = chats.reduce((sum, c) => sum + c.unread, 0);

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
                key={chat.id}
                chat={chat}
                active={activeId === chat.id}
                onClick={() => setActiveId(chat.id)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
