


import { useEffect, useState } from "react";
import { Plus, PiggyBank, AlertTriangle, TrendingUp, Target, Wallet } from "lucide-react";
import api from "../api/axios";
import { BudgetCard } from "../components/BudgetCard";

const CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Entertainment", "Health", "Education", "Salary", "Investment", "Others"];

const now = new Date();
const emptyForm = {
  category: "Food", monthlyLimit: "",
  month: now.getMonth() + 1, year: now.getFullYear(), alertThreshold: 80,
};

const PAGE_BG   = "linear-gradient(135deg,#0f0c29 0%,#1a1040 50%,#0f0c29 100%)";
const glassCard = "relative backdrop-blur-2xl bg-white/[0.06] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden";
const inputCls  = "w-full px-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white/90 placeholder-white/30 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.1] transition-all duration-200";
const selectCls = "w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/[0.12] text-white/80 text-sm focus:outline-none focus:border-indigo-500/60 transition-all duration-200";
const labelCls  = "block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1.5";

function fmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

/* ── Summary stat mini-card ── */
function MiniStat({ label, value, color, icon: Icon, glow }) {
  return (
    <div
      className="flex-1 rounded-xl p-4 flex items-center gap-3 min-w-0"
      style={{ background: `${color}0f`, border: `1px solid ${color}25` }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30`, boxShadow: `0 0 12px ${color}30` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
        <p className="text-base font-bold truncate" style={{ background: `linear-gradient(90deg,${color},${color}cc)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

/* ── Alert banner ── */
function AlertBanner({ budgets }) {
  const overBudget = budgets.filter((b) => b.status === "over_budget");
  const warnings   = budgets.filter((b) => b.status === "warning");
  if (!overBudget.length && !warnings.length) return null;

  return (
    <div className="space-y-2">
      {overBudget.map((b) => (
        <div
          key={b._id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
        >
          <AlertTriangle size={15} className="shrink-0" />
          <span>
            <strong>{b.category}</strong> is over budget — spent {fmt(b.spent)} of {fmt(b.monthlyLimit)} limit ({(b.percentageUsed || 0).toFixed(1)}%)
          </span>
        </div>
      ))}
      {warnings.map((b) => (
        <div
          key={b._id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#fbbf24" }}
        >
          <AlertTriangle size={15} className="shrink-0" />
          <span>
            <strong>{b.category}</strong> is nearing its limit — {(b.percentageUsed || 0).toFixed(1)}% used ({fmt(b.monthlyLimit - (b.spent || 0))} remaining)
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Category comparison bar chart (frontend-only) ── */
function SpendingComparison({ budgets }) {
  if (!budgets.length) return null;
  const sorted = [...budgets].sort((a, b) => (b.percentageUsed || 0) - (a.percentageUsed || 0));

  return (
    <div className={`relative ${glassCard}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-violet-600/5 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 rounded-full bg-indigo-400" style={{ boxShadow: "0 0 6px #6366f1" }} />
          <h3 className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.55)" }}>
            Category Spending Comparison
          </h3>
        </div>

        <div className="space-y-3">
          {sorted.map((b) => {
            const pct = Math.min(b.percentageUsed || 0, 100);
            const remaining = Math.max((b.monthlyLimit || 0) - (b.spent || 0), 0);
            const alertPct  = b.alertThreshold || 80;

            let barColor = "#22c55e";
            let glowColor = "rgba(34,197,94,0.4)";
            if (pct >= 100)       { barColor = "#ef4444"; glowColor = "rgba(239,68,68,0.4)"; }
            else if (pct >= alertPct) { barColor = "#f59e0b"; glowColor = "rgba(245,158,11,0.4)"; }

            return (
              <div key={b._id} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{b.category}</span>
                    {pct >= 100 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}>Over</span>
                    )}
                    {pct >= alertPct && pct < 100 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24" }}>Alert</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>{fmt(b.spent || 0)} / {fmt(b.monthlyLimit)}</span>
                    <span className="font-bold" style={{ color: barColor }}>{pct.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Progress track with alert threshold marker */}
                <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg,${barColor}cc,${barColor})`, boxShadow: `0 0 8px ${glowColor}` }}
                  />
                  {/* Alert threshold marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 opacity-60"
                    style={{ left: `${alertPct}%`, background: "rgba(245,158,11,0.9)", boxShadow: "0 0 4px rgba(245,158,11,0.6)" }}
                    title={`Alert at ${alertPct}%`}
                  />
                </div>

                <div className="flex justify-between mt-1">
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}>
                    {fmt(remaining)} remaining
                  </span>
                  <span className="text-[11px]" style={{ color: "rgba(245,158,11,0.6)" }}>
                    ⚡ {alertPct}% alert
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function Budget() {
  const [budgets, setBudgets]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
  const [filterYear, setFilterYear]   = useState(now.getFullYear());
  const [error, setError]           = useState("");

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/budget/status", {
        params: { month: filterMonth, year: filterYear },
      });
      setBudgets(data?.data?.categories || []);
    } catch {
      setError("Failed to fetch budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBudgets(); }, [filterMonth, filterYear]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/budget", {
        ...form,
        monthlyLimit:    parseFloat(form.monthlyLimit),
        month:           parseInt(form.month),
        year:            parseInt(form.year),
        alertThreshold:  parseInt(form.alertThreshold),
      });
      setForm(emptyForm);
      fetchBudgets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add budget.");
    } finally {
      setSubmitting(false);
    }
  };

  const years  = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i).toLocaleString("default", { month: "long" }),
  }));

  /* Frontend-computed summary stats */
  const totalBudgeted = budgets.reduce((s, b) => s + (b.monthlyLimit || 0), 0);
  const totalSpent    = budgets.reduce((s, b) => s + (b.spent || 0), 0);
  const totalRemaining = Math.max(totalBudgeted - totalSpent, 0);
  const overallPct    = totalBudgeted ? Math.min((totalSpent / totalBudgeted) * 100, 100) : 0;

  return (
    <div className="relative p-6 space-y-6 min-h-screen" style={{ background: PAGE_BG }}>
      <style>{`
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glowPulse{0%,100%{opacity:.45}50%{opacity:1}}
        @keyframes spin360{to{transform:rotate(360deg)}}
        .fadein-0{animation:fadeUp .45s ease both}
        .fadein-1{animation:fadeUp .45s .08s ease both}
        .fadein-2{animation:fadeUp .45s .16s ease both}
        .fadein-3{animation:fadeUp .45s .24s ease both}
        .fadein-4{animation:fadeUp .45s .32s ease both}
        .glow-dot{animation:glowPulse 2.8s ease-in-out infinite}
        .submit-btn:hover:not(:disabled){box-shadow:0 0 28px rgba(99,102,241,0.55);transform:translateY(-1px)}
        .submit-btn:active:not(:disabled){transform:translateY(0)}
        .submit-btn{transition:all .2s ease}
        .filter-sel:hover{border-color:rgba(99,102,241,0.5)}
        .loading-ring{animation:spin360 .8s linear infinite}
      `}</style>

      {/* Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 left-1/4 w-[480px] h-[480px] rounded-full bg-indigo-600/15 blur-3xl" />
        <div className="absolute top-2/3 -right-20 w-80 h-80 rounded-full bg-violet-600/12 blur-3xl" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 rounded-full bg-indigo-500/8 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative flex items-center gap-3 fadein-0">
        <div className="w-1 h-7 rounded-full bg-gradient-to-b from-indigo-400 to-violet-500" style={{ boxShadow: "0 0 12px rgba(99,102,241,0.6)" }} />
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ background: "linear-gradient(90deg,#a5b4fc,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          Budget
        </h2>
        <span className="glow-dot w-2 h-2 rounded-full bg-indigo-400" style={{ boxShadow: "0 0 8px rgba(99,102,241,0.8)" }} />
        {budgets.length > 0 && (
          <span
            className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}
          >
            {budgets.length} budget{budgets.length !== 1 ? "s" : ""} active
          </span>
        )}
      </div>

      {error && (
        <div className="relative backdrop-blur-xl bg-red-500/10 border border-red-500/25 rounded-2xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── Summary stats bar ── */}
      {!loading && budgets.length > 0 && (
        <div className="relative flex flex-wrap gap-3 fadein-0">
          <MiniStat label="Total Budgeted"  value={fmt(totalBudgeted)}  color="#6366f1" icon={Target}    />
          <MiniStat label="Total Spent"     value={fmt(totalSpent)}     color="#ef4444" icon={Wallet}    />
          <MiniStat label="Total Remaining" value={fmt(totalRemaining)} color="#22c55e" icon={TrendingUp} />
        </div>
      )}

      {/* ── Overall progress bar ── */}
      {!loading && budgets.length > 0 && (
        <div
          className="relative rounded-2xl p-4 overflow-hidden fadein-1"
          style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.16)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
              Overall Budget Health
            </span>
            <span
              className="text-xs font-bold"
              style={{ color: overallPct >= 100 ? "#f87171" : overallPct >= 80 ? "#fbbf24" : "#4ade80" }}
            >
              {overallPct.toFixed(1)}% used
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${overallPct}%`,
                background: overallPct >= 100
                  ? "linear-gradient(90deg,#ef4444,#f87171)"
                  : overallPct >= 80
                  ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                  : "linear-gradient(90deg,#6366f1,#8b5cf6)",
                boxShadow: overallPct >= 100 ? "0 0 10px rgba(239,68,68,0.5)" : overallPct >= 80 ? "0 0 10px rgba(245,158,11,0.5)" : "0 0 10px rgba(99,102,241,0.5)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}>{fmt(totalSpent)} spent</span>
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}>{fmt(totalBudgeted)} total limit</span>
          </div>
        </div>
      )}

      {/* ── Alert banners ── */}
      {!loading && budgets.length > 0 && (
        <div className="relative fadein-1">
          <AlertBanner budgets={budgets} />
        </div>
      )}

      {/* ── ADD FORM ── */}
      <div className={`relative ${glassCard} fadein-2`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-violet-600/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        <div className="relative p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Plus size={14} className="text-indigo-400" />
            </div>
            <h3
              className="text-sm font-bold uppercase tracking-widest"
              style={{ background: "linear-gradient(90deg,#a5b4fc,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Add Budget
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={selectCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Monthly Limit (₹)</label>
              <input type="number" name="monthlyLimit" value={form.monthlyLimit} onChange={handleChange}
                required min="1" placeholder="0.00" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Month</label>
              <select name="month" value={form.month} onChange={handleChange} className={selectCls}>
                {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <select name="year" value={form.year} onChange={handleChange} className={selectCls}>
                {years.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Alert Threshold (%)</label>
              <div className="relative">
                <input type="number" name="alertThreshold" value={form.alertThreshold} onChange={handleChange}
                  min="1" max="100" placeholder="80" className={inputCls} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30 pointer-events-none">%</span>
              </div>
              <p className="text-[11px] text-white/25 mt-1">You'll see a warning marker at this threshold</p>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="submit-btn w-full py-2.5 rounded-xl text-sm font-bold text-white tracking-wide disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}
              >
                {submitting ? (
                  <>
                    <svg className="loading-ring w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Adding...
                  </>
                ) : (<><Plus size={15} /> Add Budget</>)}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Category comparison (frontend visual) ── */}
      {!loading && budgets.length > 0 && (
        <div className="fadein-3">
          <SpendingComparison budgets={budgets} />
        </div>
      )}

      {/* ── Budget cards grid ── */}
      <div className={`relative ${glassCard} fadein-4`}>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-indigo-600/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        <div className="relative p-6">

          {/* Header + filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2.5 flex-1">
              <span className="w-2 h-2 rounded-full bg-violet-400 glow-dot" style={{ boxShadow: "0 0 6px #8b5cf6" }} />
              <h3
                className="text-sm font-bold uppercase tracking-widest"
                style={{ background: "linear-gradient(90deg,#a5b4fc,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                Budget Cards
              </h3>
            </div>

            <select value={filterMonth} onChange={(e) => setFilterMonth(Number(e.target.value))}
              className="filter-sel px-3 py-2 rounded-xl bg-slate-900/80 border border-white/[0.12] text-white/70 text-sm focus:outline-none focus:border-indigo-500/60 transition-all">
              {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <select value={filterYear} onChange={(e) => setFilterYear(Number(e.target.value))}
              className="filter-sel px-3 py-2 rounded-xl bg-slate-900/80 border border-white/[0.12] text-white/70 text-sm focus:outline-none focus:border-indigo-500/60 transition-all">
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 rounded-2xl"
                  style={{
                    background: "linear-gradient(90deg,rgba(99,102,241,0.07) 0%,rgba(139,92,246,0.13) 50%,rgba(99,102,241,0.07) 100%)",
                    backgroundSize: "200% 100%",
                    animation: `shimmer ${1.5 + i * 0.15}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
          ) : budgets.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget) => (
                <BudgetCard key={budget._id} budget={budget} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 0 24px rgba(99,102,241,0.1)" }}
              >
                <PiggyBank size={26} className="text-indigo-400/60" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white/30">No budgets set</p>
                <p className="text-xs text-white/18 mt-1">
                  Add a budget above to start tracking your spending
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
