

const statusConfig = {
  on_track: {
    label: "On Track",
    badgeBg: "rgba(34,197,94,0.12)",
    badgeBorder: "rgba(34,197,94,0.25)",
    badgeColor: "#4ade80",
    barFrom: "#22c55e",
    barTo: "#4ade80",
    barGlow: "rgba(34,197,94,0.4)",
    dotColor: "#22c55e",
  },
  warning: {
    label: "Warning",
    badgeBg: "rgba(245,158,11,0.12)",
    badgeBorder: "rgba(245,158,11,0.25)",
    badgeColor: "#fbbf24",
    barFrom: "#f59e0b",
    barTo: "#fbbf24",
    barGlow: "rgba(245,158,11,0.4)",
    dotColor: "#f59e0b",
  },
  over_budget: {
    label: "Over Budget",
    badgeBg: "rgba(239,68,68,0.12)",
    badgeBorder: "rgba(239,68,68,0.25)",
    badgeColor: "#f87171",
    barFrom: "#ef4444",
    barTo: "#f87171",
    barGlow: "rgba(239,68,68,0.4)",
    dotColor: "#ef4444",
  },
};

export function BudgetCard({ budget }) {
  const status = statusConfig[budget.status] || statusConfig.on_track;
  const pct = Math.min(budget.percentageUsed || 0, 100);

  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden group"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 14px 40px rgba(0,0,0,0.35), 0 0 20px ${status.barGlow}`;
        e.currentTarget.style.borderColor = status.badgeBorder;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
      }}
    >
      {/* Hover accent overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at top right, ${status.badgeBg}, transparent 70%)` }}
      />

      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${status.dotColor}70, transparent)` }}
      />

      {/* Header row */}
      <div className="relative flex items-start justify-between mb-4">
        <div>
          <p
            className="font-bold text-base tracking-tight"
            style={{ color: "rgba(255,255,255,0.88)" }}
          >
            {budget.category}
          </p>
          <p className="text-[11px] font-medium mt-0.5 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.28)" }}>
            {budget.month}/{budget.year}
          </p>
        </div>

        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 uppercase tracking-wide"
          style={{
            background: status.badgeBg,
            border: `1px solid ${status.badgeBorder}`,
            color: status.badgeColor,
          }}
        >
          {status.label}
        </span>
      </div>

      {/* Spend info */}
      <div className="relative space-y-2">
        <div className="flex justify-between items-baseline text-sm">
          <span style={{ color: "rgba(255,255,255,0.38)", fontSize: "12px" }}>
            ₹{Number(budget.spent || 0).toLocaleString("en-IN")} spent
          </span>
          <span className="font-bold text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
            ₹{Number(budget.monthlyLimit).toLocaleString("en-IN")}
          </span>
        </div>

        {/* Progress track */}
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-in-out"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${status.barFrom}, ${status.barTo})`,
              boxShadow: `0 0 8px ${status.barGlow}`,
            }}
          />
        </div>

        <p
          className="text-right font-semibold"
          style={{ fontSize: "11px", color: status.badgeColor }}
        >
          {pct.toFixed(1)}% used
        </p>
      </div>

      {/* Corner status dot */}
      <div
        className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full opacity-40 group-hover:opacity-90 transition-opacity"
        style={{ background: status.dotColor, boxShadow: `0 0 6px ${status.dotColor}` }}
      />
    </div>
  );
}
