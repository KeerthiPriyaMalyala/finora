
import { Trash2 } from "lucide-react";

const categoryConfig = {
  Food:          { bg: "rgba(251,146,60,0.12)",  border: "rgba(251,146,60,0.25)",  color: "#fb923c" },
  Travel:        { bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.25)",  color: "#60a5fa" },
  Bills:         { bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.25)",  color: "#c084fc" },
  Shopping:      { bg: "rgba(236,72,153,0.12)",  border: "rgba(236,72,153,0.25)",  color: "#f472b6" },
  Entertainment: { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)",  color: "#fbbf24" },
  Health:        { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)",   color: "#f87171" },
  Education:     { bg: "rgba(6,182,212,0.12)",   border: "rgba(6,182,212,0.25)",   color: "#22d3ee" },
  Salary:        { bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.25)",   color: "#4ade80" },
  Investment:    { bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.25)",  color: "#a5b4fc" },
  Others:        { bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.2)",  color: "#94a3b8" },
};

export function ExpenseCard({ expense, onDelete }) {
  const cat = categoryConfig[expense.category] || categoryConfig.Others;
  const isIncome = expense.transactionType === "income";

  return (
    <div
      className="relative rounded-xl p-4 flex items-center gap-3 overflow-hidden group"
      data-testid={`card-expense-${expense._id}`}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px) scale(1.002)";
        e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.3), 0 0 12px ${cat.bg}`;
        e.currentTarget.style.borderColor = cat.border;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(ellipse at left, ${cat.bg}, transparent 70%)` }}
      />

      {/* Category badge */}
      <span
        className="relative text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 uppercase tracking-wide"
        style={{
          background: cat.bg,
          border: `1px solid ${cat.border}`,
          color: cat.color,
        }}
      >
        {expense.category}
      </span>

      {/* Description + meta */}
      <div className="relative flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: "rgba(255,255,255,0.82)" }}
        >
          {expense.description || expense.category}
        </p>
        <p
          className="text-[11px] mt-0.5 truncate"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          {expense.paymentMethod}
          <span className="mx-1.5 opacity-50">·</span>
          {new Date(expense.date || Date.now()).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Amount */}
      <span
        className="relative text-base font-bold shrink-0"
        style={{
          background: isIncome
            ? "linear-gradient(90deg, #4ade80, #86efac)"
            : "linear-gradient(90deg, #f87171, #fca5a5)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {isIncome ? "+" : "-"}₹{Number(expense.amount).toLocaleString("en-IN")}
      </span>

      {/* Delete button */}
      <button
        onClick={() => onDelete(expense._id)}
        className="relative shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
        style={{
          color: "rgba(255,255,255,0.25)",
          background: "transparent",
          border: "1px solid transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#f87171";
          e.currentTarget.style.background = "rgba(239,68,68,0.12)";
          e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.25)";
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "transparent";
        }}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
