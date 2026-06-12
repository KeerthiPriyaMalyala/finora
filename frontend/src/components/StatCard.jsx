


const colorMap = {
  indigo: {
    iconBg: "rgba(99,102,241,0.15)",
    iconBorder: "rgba(99,102,241,0.3)",
    iconColor: "#a5b4fc",
    glow: "rgba(99,102,241,0.25)",
    valueGradient: "linear-gradient(90deg, #a5b4fc, #c4b5fd)",
    cardAccent: "rgba(99,102,241,0.08)",
    dotColor: "#6366f1",
  },
  green: {
    iconBg: "rgba(34,197,94,0.12)",
    iconBorder: "rgba(34,197,94,0.25)",
    iconColor: "#4ade80",
    glow: "rgba(34,197,94,0.2)",
    valueGradient: "linear-gradient(90deg, #4ade80, #86efac)",
    cardAccent: "rgba(34,197,94,0.06)",
    dotColor: "#22c55e",
  },
  red: {
    iconBg: "rgba(239,68,68,0.12)",
    iconBorder: "rgba(239,68,68,0.25)",
    iconColor: "#f87171",
    glow: "rgba(239,68,68,0.2)",
    valueGradient: "linear-gradient(90deg, #f87171, #fca5a5)",
    cardAccent: "rgba(239,68,68,0.06)",
    dotColor: "#ef4444",
  },
  yellow: {
    iconBg: "rgba(245,158,11,0.12)",
    iconBorder: "rgba(245,158,11,0.25)",
    iconColor: "#fbbf24",
    glow: "rgba(245,158,11,0.2)",
    valueGradient: "linear-gradient(90deg, #fbbf24, #fde68a)",
    cardAccent: "rgba(245,158,11,0.06)",
    dotColor: "#f59e0b",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "indigo",
  subtitle,
}) {
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div
      className="relative rounded-2xl p-5 flex items-center gap-4 overflow-hidden group cursor-default"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 24px ${c.glow}`;
        e.currentTarget.style.borderColor = c.iconBorder;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
      }}
    >
      {/* Card background accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at top left, ${c.cardAccent}, transparent 70%)` }}
      />

      {/* Top edge glow line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${c.dotColor}60, transparent)` }}
      />

      {/* Icon container */}
      <div
        className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
        style={{
          background: c.iconBg,
          border: `1px solid ${c.iconBorder}`,
          boxShadow: `0 0 14px ${c.glow}`,
        }}
      >
        <Icon size={20} style={{ color: c.iconColor }} aria-hidden="true" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 relative">
        <p className="text-[11px] font-semibold text-white/35 uppercase tracking-widest mb-1">{title}</p>
        <p
          className="text-2xl font-bold truncate leading-tight"
          style={{
            background: c.valueGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-[11px] text-white/25 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Corner dot */}
      <div
        className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ background: c.dotColor, boxShadow: `0 0 6px ${c.dotColor}` }}
      />
    </div>
  );
}
