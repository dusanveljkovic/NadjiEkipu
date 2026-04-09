export default function ChatAvatar ({initials, bg, color, size = 32}) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: bg, color, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size < 32 ? 11 : 12, fontWeight: 500,
      }}
      >
      {initials}
    </div>
  )
}
