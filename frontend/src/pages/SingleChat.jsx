//
// Napisao Dusan Veljkovic 2023/0417
//
import { useEffect, useRef, useState } from "react"
import ChatAvatar from "../components/ChatAvatar"
import { getFullChat } from "../services/chatService";
import { getRandomColor } from "../services/utils";
import chatSocket from "../services/chatSocket";
import { getUserData } from "../services/api";
import { useParams } from "react-router-dom";
const primaryColor = "#3852B4";

const users = [
  { name: "jana", initials: "JA", online: true, bg: "#EEEEEE", color: "#0F6E56" },
  { name: "ana", initials: "AN", online: true, bg: "#FAECE7", color: "#993C1D" },
  { name: "dusan", initials: "DU", online: false, bg: "#E6F1FB", color: "#185FA5" },
  { name: "tigar", initials: "TI", online: true, bg: "#FAEEDA", color: "#854F0B" },
]

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function Message({ msg, showAvatar, last }) {
  const AVATAR_SIZE = 32
  const { bg, color } = getRandomColor(msg.sender_name)

  return (
    <div className={`flex gap-2 items-start ${msg.is_own ? "flex-row-reverse" : ""}`}>
      {showAvatar && !msg.is_own ? (
        <ChatAvatar initials={msg.sender_name.slice(0, 3).toUpperCase()} bg={bg} color={color} size={AVATAR_SIZE} />
      ) : (!msg.is_own &&
        <div style={{ width: AVATAR_SIZE, flexShrink: 0 }} />
      )}
      <div className={`flex flex-col gap-1 max-w-[%62] ${msg.is_own ? "items-end" : ""}`}>
        {!msg.is_own && showAvatar && (
          <span className="text-[11px] text-gray-400">{msg.sender_name}</span>
        )}
        <div
          className="px-3 py-2 rounded-2xl text-[13px] leading-relaxed break-words"
          style={
            msg.is_own
              ? { background: primaryColor, color: "white" }
              : { background: "white", border: "0.5px solid rgba(0,0,0,0.1)", color: "black" }
          }
        >
          {msg.message}
        </div>
        {last && (
          <span className="text-[10px] text-gray-400 mb-4">{new Date(msg.sent_at).toLocaleString('sr-RS', {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        )}
      </div>
    </div>
  )
}

function UserItem({ user }) {
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
  const { chatId } = useParams()
  const [isConnected, setIsConnected] = useState(false)
  const [title, setTitle] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)
  const textAreaRef = useRef(null)
  const userId = getUserData().idusers

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    getFullChat(chatId)
      .then((data) => {
        setMessages(data.messages)
        setTitle(data.activity_title)
      })
      .catch(() => { })

    const token = localStorage.getItem('auth_token')

    if (token) {
      chatSocket.connect(chatId, token)
      setIsConnected(true)

      const messageHandler = (data) => {
        setMessages(prev => [...prev, {
          message_id: data.message_id || Date.now(),
          sender_id: data.sender_id,
          sender_name: data.sender_name,
          message: data.message,
          is_own: data.sender_id === userId,
          sent_at: data.sent_at || new Date().toISOString()
        }])
      }

      const historyHandler = (data) => {
        setMessages(data.messages.map(item => ({ ...item, is_own: item.sender_id === userId })) || [])
      }

      chatSocket.on('message', messageHandler)
      chatSocket.on('history', historyHandler)

      return () => {
        chatSocket.off('message', messageHandler)
        chatSocket.off('history', historyHandler)
        chatSocket.disconnect()
        setIsConnected(false)
      }
    }
  }, [chatId, userId])

  const onlineUsers = users.filter((u) => u.online)
  const offlineUsers = users.filter((u) => !u.online)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!input.trim() || !isConnected) return

    chatSocket.sendMessage(input.trim())
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(e)
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
              {title.slice(0, 3).toUpperCase()}
            </div>
            <div>
              <p className="text-[15px] font-medium text-gray-900">{title}</p>
              <p className="text-[12px] text-gray-500">{onlineUsers.length} online</p>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto flex flex-col p-5"
            style={{ background: "#efefed" }}
          >
            {messages.map((msg, i) => {
              const prev = messages[i - 1]
              const next = messages[i + 1]
              const sameAsNext = next && next.sender_id === msg.sender_id && next.is_own === msg.is_own
              const sameAsPrev = prev && prev.sender_id === msg.sender_id && prev.is_own === msg.is_own;
              return (
                <div key={msg.message_id} style={{ marginTop: sameAsPrev ? 2 : 12 }}>
                  <Message msg={msg} showAvatar={!sameAsPrev} last={!sameAsNext} />
                </div>
              )
            })}
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
              onClick={handleSendMessage}
              className="flex items-center justify-center rounded-full flex-shrink-0 transition-opacity hover:opacity-85 bg-primary"
              style={{ width: 36, height: 36, border: "none", cursor: "pointer" }}
            >
              <i className="text-white fa-regular fa-paper-plane" />
            </button>
          </div>
        </div>

        <div className="flex-3 flex flex-col bg-white">
          <div className="px-4 py-3 border-b border-black/10">
            <p className="text-[13px] font-medium text-gray-900">Korisnici</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{users.length} korisnika</p>
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
