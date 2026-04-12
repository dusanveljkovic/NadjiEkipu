
export default function FillBar({signed, max, color = "#534AB7", useFull = false}) {
  const pct = Math.round((signed / max) * 100);
  const full = pct >= 90;
  const mid  = pct >= 60;
  const fullColor = full ? "#A32D2D" : mid ? "#854F0B" : "#534AB7";
  const barColor = useFull ? fullColor : color
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 80 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b6b67" }}>
        <span>{signed}/{max}</span>
        <span style={{ color: "#6b6b67", fontWeight: 500 }}>{pct}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 99, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: barColor, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}
