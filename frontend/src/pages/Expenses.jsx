import { useEffect, useState, useCallback } from "react";
import {
  Plus, Search, Filter, X, Edit2, ArrowUpDown, Calendar,
  CheckCircle, AlertCircle, Info, Download, Eye,
  TrendingUp, TrendingDown, Hash, Zap, BarChart2,
} from "lucide-react";

import api from "../api/axios";





/* ══════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════ */
const CATEGORIES = [
  "Food","Travel","Bills","Shopping","Entertainment",
  "Health","Education","Salary","Investment","Others","Grocery",
          "Fitness",
          "Transport",
          "Rent",
];

const CATEGORY_EMOJI = {
  Food:"🍔", Travel:"✈️", Bills:"📋", Shopping:"🛍️",
  Entertainment:"🎬", Health:"💊", Education:"📚",
  Salary:"💼", Investment:"📈", Others:"📦",Grocery:"🛒",
Fitness:"🏋️",
Transport:"🚌",
Rent:"🏠",
};

const CATEGORY_COLOR = {
  Food:"#fb923c", Travel:"#60a5fa", Bills:"#c084fc",
  Shopping:"#f472b6", Entertainment:"#fbbf24", Health:"#f87171",
  Education:"#22d3ee", Salary:"#4ade80", Investment:"#a5b4fc",
  Others:"#94a3b8",Grocery:"#34d399",
Fitness:"#f43f5e",
Transport:"#38bdf8",
Rent:"#facc15",
};

const PAYMENT_METHODS = [
  "Cash","UPI","Credit Card","Debit Card","Bank Transfer","Wallet",
];

const PAYMENT_ICONS = {
  Cash:"💵", UPI:"📱", "Credit Card":"💳", "Debit Card":"🏦",
  "Bank Transfer":"🔁", Wallet:"👛",
};

const PAYMENT_COLOR = {
  Cash:"#4ade80", UPI:"#60a5fa", "Credit Card":"#f472b6",
  "Debit Card":"#fb923c", "Bank Transfer":"#c084fc", Wallet:"#fbbf24",
};

const SORT_OPTIONS = [
  { value:"latest",  label:"Latest"  },
  { value:"oldest",  label:"Oldest"  },
  { value:"highest", label:"Highest" },
  { value:"lowest",  label:"Lowest"  },
];

const todayStr = new Date().toISOString().split("T")[0];

const emptyForm = {
  amount:"", category:"Food", description:"",
  paymentMethod:"Cash", transactionType:"expense",
  date:todayStr, tags:"", recurring:false,
};

const PAGE_BG   = "linear-gradient(135deg,#0f0c29 0%,#1a1040 50%,#0f0c29 100%)";
const glassCard = "relative backdrop-blur-2xl bg-white/[0.06] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden";
const inputCls  = "w-full px-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white/90 placeholder-white/30 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.1] transition-all duration-200";
const selectCls = "w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/[0.12] text-white/80 text-sm focus:outline-none focus:border-indigo-500/60 transition-all duration-200";
const labelCls  = "block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1.5";

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
function fmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function getDateGroup(dateStr) {
  if (!dateStr) return "Earlier";
  const d    = new Date(dateStr);
  const now  = new Date();
  const diff = Math.floor((now.setHours(0,0,0,0) - d.setHours(0,0,0,0)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff <= 6)  return "This Week";
  return "Earlier";
}

function groupByDate(transactions) {
  const order  = ["Today","Yesterday","This Week","Earlier"];
  const groups = {};
  order.forEach((g) => { groups[g] = []; });
  transactions.forEach((t) => {
    const g = getDateGroup(t.date);
    groups[g].push(t);
  });
  return order.filter((g) => groups[g].length > 0).map((g) => ({ label: g, items: groups[g] }));
}

/* ══════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════ */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3200);
  }, []);
  return { toasts, push };
}

function ToastContainer({ toasts }) {
  const icons  = { success:<CheckCircle size={15}/>, error:<AlertCircle size={15}/>, info:<Info size={15}/> };
  const colors = {
    success:{ bg:"rgba(34,197,94,0.12)",  border:"rgba(34,197,94,0.3)",  text:"#4ade80" },
    error:  { bg:"rgba(239,68,68,0.12)",  border:"rgba(239,68,68,0.3)",  text:"#f87171" },
    info:   { bg:"rgba(99,102,241,0.12)", border:"rgba(99,102,241,0.3)", text:"#a5b4fc" },
  };
  return (
    <div className="fixed top-5 right-5 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const c = colors[t.type] || colors.info;
        return (
          <div key={t.id}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium pointer-events-auto"
            style={{ background:c.bg, border:`1px solid ${c.border}`, color:c.text,
              backdropFilter:"blur(20px)", boxShadow:"0 8px 32px rgba(0,0,0,0.35)",
              animation:"toastIn .25s ease both" }}
          >
            {icons[t.type]}{t.msg}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SKELETON LOADERS
══════════════════════════════════════════════════ */
function SkeletonCard({ delay = 0 }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl"
      style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", animation:`fadeUp .4s ${delay}s ease both` }}>
      <div className="w-12 h-12 rounded-xl shrink-0 shimmer-box" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 rounded-full w-1/3 shimmer-box" />
        <div className="h-2.5 rounded-full w-1/2 shimmer-box" />
      </div>
      <div className="space-y-2 items-end flex flex-col">
        <div className="h-4 w-20 rounded-full shimmer-box" />
        <div className="h-2.5 w-14 rounded-full shimmer-box" />
      </div>
    </div>
  );
}

function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 rounded-2xl shimmer-box" />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   QUICK STATS BAR
══════════════════════════════════════════════════ */
function QuickStats({ transactions }) {
  const expenses     = transactions.filter((t) => t.transactionType !== "income");
  const incomes      = transactions.filter((t) => t.transactionType === "income");
  const totalExpense = expenses.reduce((s, t) => s + (t.amount || 0), 0);
  const totalIncome  = incomes.reduce((s, t) => s + (t.amount || 0), 0);
  const highest      = Math.max(...transactions.map((t) => t.amount || 0), 0);
  const average      = transactions.length ? transactions.reduce((s, t) => s + (t.amount || 0), 0) / transactions.length : 0;

  const stats = [
    { label:"Transactions", value:transactions.length,   icon:Hash,       color:"#a5b4fc", suffix:"" },
    { label:"Total Expense", value:fmt(totalExpense),    icon:TrendingDown, color:"#f87171", suffix:"" },
    { label:"Total Income",  value:fmt(totalIncome),     icon:TrendingUp,   color:"#4ade80", suffix:"" },
    { label:"Highest",       value:fmt(highest),         icon:Zap,          color:"#fbbf24", suffix:"" },
    { label:"Average",       value:fmt(Math.round(average)), icon:BarChart2, color:"#c084fc", suffix:"" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s) => (
        <div key={s.label}
          className="stat-card rounded-2xl p-3.5 flex flex-col gap-2"
          style={{ background:`${s.color}08`, border:`1px solid ${s.color}20` }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color:"rgba(255,255,255,0.35)" }}>{s.label}</span>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background:`${s.color}18`, boxShadow:`0 0 8px ${s.color}30` }}>
              <s.icon size={12} style={{ color:s.color }} />
            </div>
          </div>
          <p className="text-base font-bold leading-none" style={{
            background:`linear-gradient(90deg,${s.color},${s.color}aa)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAYMENT METHOD ANALYTICS
══════════════════════════════════════════════════ */
function PaymentAnalytics({ transactions }) {
  const stats = PAYMENT_METHODS.map((m) => {
    const txs   = transactions.filter((t) => t.paymentMethod === m);
    const total = txs.reduce((s, t) => s + (t.amount || 0), 0);
    return { method:m, count:txs.length, total };
  }).filter((s) => s.count > 0);

  if (!stats.length) return null;

  return (
    <div className={`relative ${glassCard}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-indigo-600/5 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      <div className="relative p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
            <BarChart2 size={13} className="text-violet-400" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest"
            style={{ background:"linear-gradient(90deg,#c4b5fd,#a5b4fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Payment Method Breakdown
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((s) => {
            const color = PAYMENT_COLOR[s.method] || "#a5b4fc";
            return (
              <div key={s.method} className="pm-card rounded-xl p-3 flex flex-col gap-1.5 cursor-default"
                style={{ background:`${color}08`, border:`1px solid ${color}20` }}>
                <div className="text-xl">{PAYMENT_ICONS[s.method]}</div>
                <p className="text-[11px] font-bold" style={{ color:"rgba(255,255,255,0.6)" }}>{s.method}</p>
                <p className="text-sm font-bold" style={{ color }}>{fmt(s.total)}</p>
                <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.3)" }}>{s.count} txn{s.count !== 1 ? "s" : ""}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   TRANSACTION CARD (inline, upgraded)
══════════════════════════════════════════════════ */
function TransactionCard({ expense, onEdit, onDelete, onClick }) {
  const isIncome = expense.transactionType === "income";
  const catColor = CATEGORY_COLOR[expense.category] || "#94a3b8";
  const tags     = Array.isArray(expense.tags) ? expense.tags.filter(Boolean) : [];

  return (
    <div
      className="tx-card group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200"
      style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)" }}
      onClick={() => onClick(expense)}
    >
      {/* Category icon */}
      <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-xl font-bold relative"
        style={{ background:`${catColor}18`, border:`1px solid ${catColor}28`, boxShadow:`0 0 14px ${catColor}18` }}>
        {CATEGORY_EMOJI[expense.category] || "📦"}
        {/* Income/Expense dot */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0f0c29] flex items-center justify-center"
          style={{ background: isIncome ? "#4ade80" : "#f87171" }}>
          <span className="text-[7px] font-black text-black">{isIncome ? "+" : "-"}</span>
        </span>
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-white/85 truncate">
            {expense.description || expense.category}
          </p>
          <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
            style={isIncome
              ? { background:"rgba(74,222,128,0.12)", color:"#4ade80", border:"1px solid rgba(74,222,128,0.25)" }
              : { background:"rgba(248,113,113,0.12)", color:"#f87171", border:"1px solid rgba(248,113,113,0.25)" }}>
            {isIncome ? "Income" : "Expense"}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-medium" style={{ color: catColor }}>
            {expense.category}
          </span>
          <span className="text-[11px] text-white/25">·</span>
          <span className="text-[11px] text-white/35">
            {PAYMENT_ICONS[expense.paymentMethod]} {expense.paymentMethod}
          </span>
          {expense.date && (
            <>
              <span className="text-[11px] text-white/25">·</span>
              <span className="text-[11px] text-white/30">
                {new Date(expense.date).toLocaleDateString("en-IN", { day:"2-digit", month:"short" })}
              </span>
            </>
          )}
          {expense.recurring && (
            <>
              <span className="text-[11px] text-white/25">·</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold"
                style={{ background:"rgba(99,102,241,0.15)", color:"#a5b4fc", border:"1px solid rgba(99,102,241,0.25)" }}>
                🔁 Recurring
              </span>
            </>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-1.5">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.4)", border:"1px solid rgba(255,255,255,0.08)" }}>
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.25)" }}>
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Amount + actions */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-base font-bold"
          style={{
            background: isIncome
              ? "linear-gradient(90deg,#4ade80,#86efac)"
              : "linear-gradient(90deg,#f87171,#fca5a5)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          }}>
          {isIncome ? "+" : "-"}{fmt(expense.amount)}
        </span>

        {/* Action buttons — visible on hover */}
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); onClick(expense); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-indigo-400 hover:bg-indigo-500/15 transition-all"
            title="View details"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(expense); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-amber-400 hover:bg-amber-500/15 transition-all"
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(expense._id); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/15 transition-all"
            title="Delete"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   TRANSACTION HISTORY (grouped)
══════════════════════════════════════════════════ */
const GROUP_STYLE = {
  Today:     { bg:"rgba(99,102,241,0.12)", border:"rgba(99,102,241,0.3)", text:"#a5b4fc",  dot:"#6366f1" },
  Yesterday: { bg:"rgba(139,92,246,0.1)", border:"rgba(139,92,246,0.25)", text:"#c4b5fd",  dot:"#8b5cf6" },
  "This Week":{ bg:"rgba(34,197,94,0.08)", border:"rgba(34,197,94,0.2)",  text:"#4ade80",  dot:"#22c55e" },
  Earlier:   { bg:"rgba(255,255,255,0.05)", border:"rgba(255,255,255,0.1)", text:"rgba(255,255,255,0.45)", dot:"rgba(255,255,255,0.3)" },
};

function TransactionHistory({ groups, onEdit, onDelete, onView }) {
  return (
    <div className="space-y-6">
      {groups.map(({ label, items }) => {
        const gs = GROUP_STYLE[label] || GROUP_STYLE.Earlier;
        return (
          <div key={label}>
            {/* Date group header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
                style={{ background:gs.bg, border:`1px solid ${gs.border}`, color:gs.text }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background:gs.dot }} />
                {label}
                <span className="ml-1 opacity-60">{items.length}</span>
              </span>
              <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg,${gs.border},transparent)` }} />
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {items.map((expense) => (
                <TransactionCard
                  key={expense._id}
                  expense={expense}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onClick={onView}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ADVANCED EMPTY STATE
══════════════════════════════════════════════════ */
function EmptyState({ onAddClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      {/* Illustration */}
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-3xl"
          style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", boxShadow:"0 0 40px rgba(99,102,241,0.12)" }} />
        <div className="absolute inset-4 rounded-2xl flex items-center justify-center"
          style={{ background:"rgba(99,102,241,0.08)" }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="24" stroke="rgba(99,102,241,0.3)" strokeWidth="1.5" />
            <path d="M14 30l8-8 6 6 10-12" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
            <circle cx="26" cy="17" r="3" fill="rgba(99,102,241,0.4)" />
            <path d="M20 38h12" stroke="rgba(99,102,241,0.3)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M23 41h6"  stroke="rgba(99,102,241,0.2)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        {/* Floating dots */}
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-violet-500/40 blur-sm" style={{ animation:"glowPulse 2s ease-in-out infinite" }} />
        <div className="absolute -bottom-1 -left-2 w-3 h-3 rounded-full bg-indigo-500/30 blur-sm" style={{ animation:"glowPulse 2.6s ease-in-out infinite" }} />
      </div>

      <div className="text-center max-w-xs">
        <p className="text-lg font-bold mb-2"
          style={{ background:"linear-gradient(90deg,#a5b4fc,#c4b5fd)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          Start tracking your finances today
        </p>
        <p className="text-sm text-white/35">
          Add your first transaction to see beautiful analytics, spending insights, and grouped history.
        </p>
      </div>

      <button
        onClick={onAddClick}
        className="submit-btn flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
        style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow:"0 4px 24px rgba(99,102,241,0.4)" }}
      >
        <Plus size={16} /> Add First Transaction
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   DETAILS MODAL
══════════════════════════════════════════════════ */
function DetailsModal({ expense, onClose, onEdit, onDelete }) {
  if (!expense) return null;
  const isIncome = expense.transactionType === "income";
  const catColor = CATEGORY_COLOR[expense.category] || "#94a3b8";
  const tags     = Array.isArray(expense.tags) ? expense.tags.filter(Boolean) : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(10,8,24,0.8)", backdropFilter:"blur(14px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background:"linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.07))",
          border:"1px solid rgba(99,102,241,0.3)",
          backdropFilter:"blur(30px)",
          animation:"fadeUp .25s ease both",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background:`${catColor}18`, border:`1px solid ${catColor}28` }}>
              {CATEGORY_EMOJI[expense.category] || "📦"}
            </div>
            <div>
              <p className="text-sm font-bold text-white/90 truncate max-w-[180px]">
                {expense.description || expense.category}
              </p>
              <p className="text-[11px]" style={{ color: catColor }}>{expense.category}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Amount hero */}
        <div className="px-6 py-5 text-center"
          style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-3xl font-black"
            style={{
              background: isIncome
                ? "linear-gradient(90deg,#4ade80,#86efac)"
                : "linear-gradient(90deg,#f87171,#fca5a5)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>
            {isIncome ? "+" : "-"}{fmt(expense.amount)}
          </span>
          <div className="mt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
              style={isIncome
                ? { background:"rgba(74,222,128,0.12)", color:"#4ade80", border:"1px solid rgba(74,222,128,0.25)" }
                : { background:"rgba(248,113,113,0.12)", color:"#f87171", border:"1px solid rgba(248,113,113,0.25)" }}>
              {isIncome ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {isIncome ? "Income" : "Expense"}
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="px-6 py-4 grid grid-cols-2 gap-3">
          {[
            { label:"Payment Method", value:`${PAYMENT_ICONS[expense.paymentMethod] || ""} ${expense.paymentMethod || "—"}` },
            { label:"Date", value: expense.date ? new Date(expense.date).toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric" }) : "—" },
            { label:"Recurring", value: expense.recurring ? "✅ Yes" : "❌ No" },
            { label:"Category",  value: expense.category || "—" },
          ].map((row) => (
            <div key={row.label} className="rounded-xl p-3"
              style={{ background:"rgba(255,255,255,0.035)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">{row.label}</p>
              <p className="text-sm font-semibold text-white/80">{row.value}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="px-6 pb-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background:"rgba(99,102,241,0.12)", color:"#a5b4fc", border:"1px solid rgba(99,102,241,0.2)" }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={() => { onClose(); onEdit(expense); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
            style={{ border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)" }}>
            <Edit2 size={14} /> Edit
          </button>
          <button onClick={() => { onClose(); onDelete(expense._id); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)", color:"#f87171" }}>
            <X size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   EDIT MODAL
══════════════════════════════════════════════════ */
function EditModal({ expense, onClose, onSave }) {
  const [form, setForm] = useState({
    amount:          expense.amount || "",
    category:        expense.category || "Food",
    description:     expense.description || "",
    paymentMethod:   expense.paymentMethod || "Cash",
    transactionType: expense.transactionType || "expense",
    date:            expense.date ? expense.date.split("T")[0] : todayStr,
    tags:            Array.isArray(expense.tags) ? expense.tags.join(", ") : (expense.tags || ""),
    recurring:       expense.recurring || false,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        tags:   form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      };
      await api.put(`/expenses/${expense._id}`, payload);
      onSave();
    } catch {
      onSave(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(10,8,24,0.8)", backdropFilter:"blur(12px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background:"linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.07))",
          border:"1px solid rgba(99,102,241,0.3)",
          backdropFilter:"blur(30px)",
          animation:"fadeUp .25s ease both",
        }}>
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Edit2 size={13} className="text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest"
              style={{ background:"linear-gradient(90deg,#a5b4fc,#c4b5fd)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Edit Transaction
            </h3>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Amount (₹)</label>
            <input type="number" name="amount" value={form.amount} onChange={handleChange} required placeholder="0.00" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} className={selectCls}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Description</label>
                        <input
              name="description"
              value={form.description}
              onChange={handleDescriptionChange}
              placeholder="What was this for?"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Payment Method</label>
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className={selectCls}>
              {PAYMENT_METHODS.map((m) => <option key={m}>{PAYMENT_ICONS[m]} {m}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Type</label>
            <select name="transactionType" value={form.transactionType} onChange={handleChange} className={selectCls}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="food, dining..." className={inputCls} />
          </div>
          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/50 border border-white/10 hover:bg-white/5 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
              style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow:"0 4px 20px rgba(99,102,241,0.35)" }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════ */
export default function Expenses() {
  const [expenses,    setExpenses]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [form,        setForm]        = useState(emptyForm);
  const [editTarget,  setEditTarget]  = useState(null);
  const [viewTarget,  setViewTarget]  = useState(null);
  const [sortBy,      setSortBy]      = useState("latest");
  const [showForm,    setShowForm]    = useState(false);
  const [filters, setFilters] = useState({
    category:"", transactionType:"", month:"",
    search:"", startDate:"", endDate:"",
  });
  const [error, setError] = useState("");
  const { toasts, push }  = useToast();


const predictCategory = async (text) => {

  try {

    // const response = await fetch(
    //   "http://localhost:8000/predict",

     const response = await fetch(
      `${import.meta.env.VITE_ML_URL}/predict`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      }
    );

    const data = await response.json();

    return data.category;

  } catch (err) {

    console.log("Prediction Error:", err);

    return "";
  }
};


  









  /* ── API calls (unchanged) ── */
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category)        params.category        = filters.category;
      if (filters.transactionType) params.transactionType = filters.transactionType;
      if (filters.month)           params.month           = filters.month;
      if (filters.search)          params.search          = filters.search;
      const res = await api.get("/expenses", { params });
      setExpenses(res?.data?.data || []);
    } catch {
      setError("Failed to fetch expenses.");
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.transactionType, filters.month, filters.search]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

const handleDescriptionChange = async (e) => {

  const value = e.target.value;

  setForm((prev) => ({
    ...prev,
    description: value,
  }));

  if (value.trim().length > 3) {

    const predicted = await predictCategory(value);

    if (predicted) {

      setForm((prev) => ({
        ...prev,
        category: predicted.trim(),
      }));

    }
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        tags:   form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      };
      await api.post("/expenses", payload);
      setForm(emptyForm);
      setShowForm(false);
      fetchExpenses();
      push("Transaction added successfully!", "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add expense.";
      setError(msg);
      push(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((p) => p.filter((e) => e._id !== id));
      push("Transaction deleted.", "info");
    } catch {
      push("Failed to delete transaction.", "error");
    }
  };

  const handleEdit = (expense) => setEditTarget(expense);

  const handleEditSave = async (hasError) => {
    setEditTarget(null);
    if (hasError) {
      push("Failed to update transaction.", "error");
    } else {
      await fetchExpenses();
      push("Transaction updated!", "success");
    }
  };

  /* ── Client-side filter + sort ── */
  const processed = expenses
  .filter((e) => {

    if (
      filters.search &&
      !e.description?.toLowerCase().includes(filters.search.toLowerCase()) &&
      !e.category?.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.startDate &&
      new Date(e.date) < new Date(filters.startDate)
    ) {
      return false;
    }

    if (
      filters.endDate &&
      new Date(e.date) > new Date(filters.endDate)
    ) {
      return false;
    }

    return true;
  })

  .sort((a, b) => {

    // 🔥 Latest First
    if (sortBy === "latest") {

      return (
        new Date(b.createdAt || b.date).getTime() -
        new Date(a.createdAt || a.date).getTime()
      );

    }

    // 🔥 Oldest First
    if (sortBy === "oldest") {

      return (
        new Date(a.createdAt || a.date).getTime() -
        new Date(b.createdAt || b.date).getTime()
      );

    }

    // 💰 Highest Amount
    if (sortBy === "highest") {

      return b.amount - a.amount;

    }

    // 💸 Lowest Amount
    if (sortBy === "lowest") {

      return a.amount - b.amount;

    }

    return 0;

  });

  const grouped = groupByDate(processed);

  const activeFiltersCount = [
    filters.category, filters.transactionType, filters.startDate, filters.endDate,
  ].filter(Boolean).length;

  /* ══════════════════════════════════
     RENDER
  ══════════════════════════════════ */
  return (
    <div className="relative p-4 sm:p-6 space-y-6 min-h-screen" style={{ background:PAGE_BG }}>
      <style>{`
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
        @keyframes glowPulse{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes spin360{to{transform:rotate(360deg)}}
        .fadein-0{animation:fadeUp .4s ease both}
        .fadein-1{animation:fadeUp .4s .07s ease both}
        .fadein-2{animation:fadeUp .4s .14s ease both}
        .fadein-3{animation:fadeUp .4s .21s ease both}
        .fadein-4{animation:fadeUp .4s .28s ease both}
        .fadein-5{animation:fadeUp .4s .35s ease both}
        .glow-dot{animation:glowPulse 2.8s ease-in-out infinite}
        .shimmer-box{
          background:linear-gradient(90deg,rgba(99,102,241,0.07) 0%,rgba(139,92,246,0.14) 50%,rgba(99,102,241,0.07) 100%);
          background-size:200% 100%;
          animation:shimmer 1.6s ease-in-out infinite;
          border-radius:8px;
        }
        .submit-btn{transition:all .2s ease}
        .submit-btn:hover:not(:disabled){box-shadow:0 0 28px rgba(99,102,241,0.55);transform:translateY(-1px)}
        .submit-btn:active:not(:disabled){transform:translateY(0)}
        .loading-ring{animation:spin360 .8s linear infinite}
        .type-btn{transition:all .18s ease}
        .sort-chip{transition:all .18s ease}
        .sort-chip:hover{border-color:rgba(99,102,241,0.5);color:rgba(255,255,255,0.8)}
        .tx-card:hover{
          background:rgba(255,255,255,0.045) !important;
          border-color:rgba(99,102,241,0.2) !important;
          transform:translateY(-1px);
          box-shadow:0 8px 28px rgba(0,0,0,0.25);
        }
        .tx-card:active{transform:translateY(0)}
        .stat-card{transition:all .2s ease}
        .stat-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.2)}
        .pm-card{transition:all .2s ease}
        .pm-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.2)}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.5)}
      `}</style>

      <ToastContainer toasts={toasts} />
      {editTarget  && <EditModal   expense={editTarget}  onClose={() => setEditTarget(null)}  onSave={handleEditSave} />}
      {viewTarget  && <DetailsModal expense={viewTarget} onClose={() => setViewTarget(null)}  onEdit={handleEdit} onDelete={handleDelete} />}

      {/* Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-indigo-600/12 blur-3xl" />
        <div className="absolute bottom-10 right-1/3 w-72 h-72 rounded-full bg-indigo-500/8 blur-3xl" />
      </div>

      {/* ── PAGE HEADER ── */}
      <div className="relative flex items-center gap-3 fadein-0">
        <div className="w-1 h-7 rounded-full bg-gradient-to-b from-indigo-400 to-violet-500"
          style={{ boxShadow:"0 0 12px rgba(99,102,241,0.6)" }} />
        <h2 className="text-2xl font-bold tracking-tight"
          style={{ background:"linear-gradient(90deg,#a5b4fc,#c4b5fd)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          Transactions
        </h2>
        <span className="glow-dot w-2 h-2 rounded-full bg-indigo-400"
          style={{ boxShadow:"0 0 8px rgba(99,102,241,0.8)" }} />

        <div className="ml-auto flex items-center gap-2">
          {expenses.length > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", color:"#a5b4fc" }}>
              {expenses.length} records
            </span>
          )}
          {/* Export button — UI only */}
          <button
            disabled
            title="Export (coming soon)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold opacity-40 cursor-not-allowed"
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)" }}>
            <Download size={13} /> Export
          </button>
          {/* Add button (toggles form) */}
          <button
            onClick={() => setShowForm((p) => !p)}
            className="submit-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
            style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow:"0 3px 16px rgba(99,102,241,0.35)" }}>
            <Plus size={13} /> {showForm ? "Close" : "Add"}
          </button>
        </div>
      </div>

      {error && (
        <div className="relative backdrop-blur-xl bg-red-500/10 border border-red-500/25 rounded-2xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── ADD FORM (collapsible) ── */}
      {showForm && (
        <div className={`relative ${glassCard} fadein-1`}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-violet-600/5 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
          <div className="relative p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Plus size={14} className="text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest"
                style={{ background:"linear-gradient(90deg,#a5b4fc,#c4b5fd)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Add Transaction
              </h3>
            </div>

            {/* Type toggle */}
            <div className="flex gap-2 mb-5">
              {["expense","income"].map((t) => (
                <button key={t} type="button"
                  onClick={() => setForm((p) => ({ ...p, transactionType:t }))}
                  className="type-btn px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border"
                  style={form.transactionType === t
                    ? { background: t === "expense" ? "linear-gradient(135deg,#ef4444,#f87171)" : "linear-gradient(135deg,#22c55e,#4ade80)", color:"#fff", borderColor:"transparent", boxShadow:`0 0 14px ${t === "expense" ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)"}` }
                    : { background:"transparent", color:"rgba(255,255,255,0.35)", borderColor:"rgba(255,255,255,0.1)" }
                  }>
                  {t === "expense" ? "💸 Expense" : "💰 Income"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Amount (₹)</label>
                <input type="number" name="amount" value={form.amount} onChange={handleChange}
                  placeholder="0.00" required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} className={selectCls}>
                  {CATEGORIES.map((c) => <option key={c}>{CATEGORY_EMOJI[c]} {c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <input name="description" value={form.description} onChange={handleDescriptionChange}
                  placeholder="What was this for?" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Payment Method</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className={selectCls}>
                  {PAYMENT_METHODS.map((m) => <option key={m}>{PAYMENT_ICONS[m]} {m}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Tags (comma separated)</label>
                <input name="tags" value={form.tags} onChange={handleChange}
                  placeholder="food, dining..." className={inputCls} />
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <button type="submit" disabled={submitting}
                  className="submit-btn px-8 py-2.5 rounded-xl text-sm font-bold text-white tracking-wide disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow:"0 4px 20px rgba(99,102,241,0.35)" }}>
                  {submitting ? (
                    <>
                      <svg className="loading-ring w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Adding...
                    </>
                  ) : (<><Plus size={15} /> Add Transaction</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── QUICK STATS BAR ── */}
      {loading ? (
        <div className="fadein-2"><SkeletonStats /></div>
      ) : expenses.length > 0 && (
        <div className="relative fadein-2">
          <QuickStats transactions={processed} />
        </div>
      )}

      {/* ── PAYMENT METHOD ANALYTICS ── */}
      {!loading && expenses.length > 0 && (
        <div className="fadein-3">
          <PaymentAnalytics transactions={processed} />
        </div>
      )}

      {/* ── TRANSACTION HISTORY ── */}
      <div className={`relative ${glassCard} fadein-4`}>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-indigo-600/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        <div className="relative p-4 sm:p-6">

          {/* ── Filters ── */}
          <div className="space-y-3 mb-6">
            {/* Row 1: search + category + type */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  placeholder="Search transactions..."
                  value={filters.search}
                  onChange={(e) => setFilters((p) => ({ ...p, search:e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white/90 placeholder-white/30 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                />
              </div>
              <div className="flex gap-2.5">
                <div className="relative">
                  <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters((p) => ({ ...p, category:e.target.value }))}
                    className="pl-8 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/[0.12] text-white/70 text-sm focus:outline-none focus:border-indigo-500/60 transition-all">
                    <option value="">All Categories</option>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <select
                  value={filters.transactionType}
                  onChange={(e) => setFilters((p) => ({ ...p, transactionType:e.target.value }))}
                  className="px-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/[0.12] text-white/70 text-sm focus:outline-none focus:border-indigo-500/60 transition-all">
                  <option value="">All Types</option>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>

            {/* Row 2: date range + sort */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
              <div className="flex items-center gap-2 flex-wrap">
                <Calendar size={13} className="text-white/30 shrink-0" />
                <input type="date" value={filters.startDate}
                  onChange={(e) => setFilters((p) => ({ ...p, startDate:e.target.value }))}
                  className="px-3 py-2 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white/70 text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                <span className="text-white/25 text-xs">to</span>
                <input type="date" value={filters.endDate}
                  onChange={(e) => setFilters((p) => ({ ...p, endDate:e.target.value }))}
                  className="px-3 py-2 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white/70 text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                {(filters.startDate || filters.endDate) && (
                  <button onClick={() => setFilters((p) => ({ ...p, startDate:"", endDate:"" }))}
                    className="text-white/30 hover:text-white/70 transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 sm:ml-auto flex-wrap">
                <ArrowUpDown size={12} className="text-white/30 shrink-0" />
                {SORT_OPTIONS.map((s) => (
                  <button key={s.value} onClick={() => setSortBy(s.value)}
                    className="sort-chip px-2.5 py-1 rounded-lg text-[11px] font-semibold border"
                    style={sortBy === s.value
                      ? { background:"rgba(99,102,241,0.2)", border:"1px solid rgba(99,102,241,0.4)", color:"#a5b4fc" }
                      : { background:"transparent", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.35)" }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active filter chips */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-white/30">Active:</span>
                {filters.category && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background:"rgba(99,102,241,0.15)", color:"#a5b4fc" }}>
                    {filters.category}
                    <button onClick={() => setFilters((p) => ({ ...p, category:"" }))}><X size={10} /></button>
                  </span>
                )}
                {filters.transactionType && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background:"rgba(99,102,241,0.15)", color:"#a5b4fc" }}>
                    {filters.transactionType}
                    <button onClick={() => setFilters((p) => ({ ...p, transactionType:"" }))}><X size={10} /></button>
                  </span>
                )}
                <button
                  onClick={() => setFilters((p) => ({ ...p, category:"", transactionType:"", startDate:"", endDate:"" }))}
                  className="text-[11px] text-white/30 hover:text-white/60 underline transition-colors">
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Section label */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-indigo-400 glow-dot" style={{ boxShadow:"0 0 6px #6366f1" }} />
            <h3 className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color:"rgba(255,255,255,0.45)" }}>
              Transaction History
            </h3>
            {!loading && processed.length > 0 && (
              <span className="text-[11px] text-white/25 ml-1">— {processed.length} result{processed.length !== 1 ? "s" : ""}</span>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} delay={i * 0.05} />)}
            </div>
          ) : processed.length > 0 ? (
            <TransactionHistory
              groups={grouped}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={(e) => setViewTarget(e)}
            />
          ) : (
            <EmptyState onAddClick={() => setShowForm(true)} />
          )}
        </div>
      </div>
    </div>
  );
}




