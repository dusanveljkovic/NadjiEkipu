import {useEffect, useRef, useState} from "react"
import ChatAvatar from "../components/ChatAvatar"

const users = [
  { name: "jana", initials: "JA", online: true, bg: "#E1F5EE", color: "#0F6E56"},
  { name: "ana", initials: "AN", online: true, bg: "#FAECE7", color: "#993C1D"},
  { name: "dusan", initials: "DU", online: false, bg: "#E6F1FB", color: "#185FA5"},
  { name: "tigar", initials: "TI", online: true, bg: "#FAEEDA", color: "#854F0B"},
]

const initial_messages = [
  {id: 1,  name: "jana", initials: "JA", online: true, bg: "#E1F5EE", color: "#0F6E56", text: "text1", self: false},
  {id: 2,  name: "jana", initials: "JA", online: true, bg: "#E1F5EE", color: "#0F6E56", text: "text2", self: false},
  {id: 3,  name: "jana", initials: "JA", online: true, bg: "#E1F5EE", color: "#0F6E56", text: "text3", self: false},
  {id: 4, name: "tigar", initials: "TI", online: false, bg: "#FAEEDA", color: "#854F0B", text: "text4", self: false},
  {id: 5, name: "tigar", initials: "TI", online: false, bg: "#FAEEDA", color: "#854F0B", text: "text5", self: false},
]

function getTime() {
  return new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
}

function Message({msg}) {
  return (
    <div className={`flex gap-2 items-start ${msg.self ? "flex-row-reverse": ""}`}>
      <ChatAvatar initials={msg.initials} bg={msg.bg} color={msg.color} />
      <div className={`flex flex-col gap-1 max-w-[%62] ${msg.self ? "items-end" : ""}`}>
        {!msg.self && (
          <span className="text-[11px] text-gray-400">{msg.name}</span>
        )}
        <div 
          className="px-3 py-2 rounded-2xl text-[13px] leading-relaxed break-words"
          style={
            msg.self
              ? {background: "#534AB7", color: "#ffffff"}
              : {background: "white", border: "0.5px solid rgba(0,0,0,0.1)", color: "#1a1a18"}
          }
        >
          {msg.text}
        </div>
      </div>
    </div>
  )
}

function UserItem({user}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1">
      <div className="relative flex-shrink-0">
        <ChatAvatar initials={user.initials} bg={user.bg} color={user.color} size={30} />
        <div
          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white ${user.online ? "bg-green-400" : "bg-gray-400"}`}
          />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] text-gray-900 truncate">{user.name}</p>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState(initial_messages)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)
  const textAreaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
  }, [messages])

  const onlineUsers = users.filter((u) => u.online)
  const offlineUsers = users.filter((u) => !u.online)

  function sendMessage() {
    const text = input.trim()
    if(!text) return
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "Me",
        initials: "ME",
        bg: "#EEEDFE",
        color: "#534AB7",
        text,
        time: getTime,
        self: true
      }
    ])
    setInput("")
    if(textAreaRef.current) {
      textAreaRef.current.style.height = "auto"
    }
  }

  function handleKeyDown(e) {
    if(e.key === "Enter" && !e.shiftKey) {
      e.preventDefualt()
      sendMessage()
    }
  }

  function handleInput(e) {
    setInput(e.target.value)
    const el = textAreaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = Math.min(el.scrollHeight, 100) + "px"
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f5f3] p-4">
      <div
        className="flex w-full max-w-5xl rounded-xl overflow-hidden"
        style={{
          height: "92vh",
          minHeight: 500,
          border: "0.5px solid rgba(0,0,0,0.1)",
          boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
          background: "white",
        }}
      >
        <div className="flex-7 flex flex-col border-r border-black/10">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-black/10 bg-white">
            <div
              className="flex items-center justify-center rounded-full text-[13px] font-medium"
              style={{ width: 36, height: 36, background: "#EEEDFE", color: "#534AB7" }}
            >
              GC
            </div>
            <div>
              <p className="text-[15px] font-medium text-gray-900">Chat</p>
              <p className="text-[12px] text-gray-500">{onlineUsers.length} online</p>
            </div>
          </div>
 
          <div
            className="flex-1 overflow-y-auto flex flex-col gap-4 p-5"
            style={{ background: "#efefed" }}
          >
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
 
          {/* Input */}
          <div className="flex items-end gap-2.5 px-5 py-3.5 border-t border-black/10 bg-white">
            <textarea
              ref={textAreaRef}
              rows={1}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Napisi poruku..."
              className="flex-1 resize-none text-[13.5px] text-gray-900 bg-gray-100 outline-none leading-relaxed px-3 py-2 rounded-full"
              style={{
                border: "0.5px solid rgba(0,0,0,0.18)",
                maxHeight: 100,
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={sendMessage}
              className="flex items-center justify-center rounded-full flex-shrink-0 transition-opacity hover:opacity-85 bg-primary"
              style={{ width: 36, height: 36, border: "none", cursor: "pointer" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
 
        <div className="flex-3 flex flex-col bg-white">
          <div className="px-4 py-3 border-b border-black/10">
            <p className="text-[13px] font-medium text-gray-900">Members</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{users.length} members</p>
          </div>
 
          <div className="flex-1 overflow-y-auto py-2">
            {onlineUsers.length > 0 && (
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-3.5 pt-2 pb-1">
                  Online — {onlineUsers.length}
                </p>
                {onlineUsers.map((u) => (
                  <UserItem key={u.name} user={u} />
                ))}
              </div>
            )}
            {offlineUsers.length > 0 && (
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-3.5 pt-3 pb-1">
                  Offline — {offlineUsers.length}
                </p>
                {offlineUsers.map((u) => (
                  <UserItem key={u.name} user={u} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
