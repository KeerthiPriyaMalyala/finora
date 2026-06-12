

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area,
} from "recharts";

import api from "../api/axios";
import { StatCard } from "../components/StatCard";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899"];

const PAGE_BG = "linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0f0c29 100%)";

const glassCard =
  "relative backdrop-blur-2xl bg-white/[0.06] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden";

const CATEGORY_COLORS = {
  Food: "#fb923c", Travel: "#60a5fa", Bills: "#c084fc", Shopping: "#f472b6",
  Entertainment: "#fbbf24", Health: "#f87171", Education: "#22d3ee",
  Salary: "#4ade80", Investment: "#a5b4fc", Others: "#94a3b8",
};

function fmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function SectionHeader({ color = "#a5b4fc", dotColor = "#6366f1", children }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}` }}
      />
      <h3
        className="text-[11px] font-bold uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {children}
      </h3>
    </div>
  );
}

function Skeleton({ className = "" }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background:
          "linear-gradient(90deg,rgba(99,102,241,0.08) 0%,rgba(139,92,246,0.15) 50%,rgba(99,102,241,0.08) 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s infinite",
      }}
    />
  );
}

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.35;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="rgba(255,255,255,0.6)" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={10}>
      {name} {(percent * 100).toFixed(0)}%
    </text>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res?.data?.data || null))
      .catch((err) => {
        console.log("Dashboard API missing:", err?.message);
        setError("Dashboard API not found. Build backend dashboard route first.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="relative p-6 space-y-6 min-h-screen" style={{ background: PAGE_BG }}>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-72 lg:col-span-2" />
        </div>
        <Skeleton className="h-72" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative p-6 min-h-screen" style={{ background: PAGE_BG }}>
        <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/25 rounded-2xl p-4 text-red-400 text-sm">
          {error}
        </div>
      </div>
    );
  }

  const {
    totalIncome = 0,
    totalExpense = 0,
    savings = 0,
    categoryBreakdown = [],
  } = data || {};

  

  const expenseByCategory = categoryBreakdown;
 const monthlyTrend = data?.monthlyTrend || [];
const recentTransactions = data?.recentTransactions || [];
  const savingsPct = totalIncome ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="relative p-6 space-y-6 min-h-screen" style={{ background: PAGE_BG }}>
      <style>{`
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glowPulse{0%,100%{opacity:.45}50%{opacity:1}}
        .fadein-0{animation:fadeUp .45s ease both}
        .fadein-1{animation:fadeUp .45s .08s ease both}
        .fadein-2{animation:fadeUp .45s .16s ease both}
        .fadein-3{animation:fadeUp .45s .24s ease both}
        .fadein-4{animation:fadeUp .45s .32s ease both}
        .glow-dot{animation:glowPulse 2.8s ease-in-out infinite}
        .tx-row:hover{background:rgba(255,255,255,0.035)}
      `}</style>

      {/* Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-indigo-600/18 blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-violet-600/14 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Page header */}
      <div className="relative flex items-center justify-between fadein-0">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-gradient-to-b from-indigo-400 to-violet-500" style={{ boxShadow: "0 0 12px rgba(99,102,241,0.6)" }} />
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ background: "linear-gradient(90deg,#a5b4fc,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Overview
          </h2>
          <span className="glow-dot w-2 h-2 rounded-full bg-indigo-400" style={{ boxShadow: "0 0 8px rgba(99,102,241,0.8)" }} />
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
          style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "rgba(165,180,252,0.8)" }}
        >
          <Calendar size={12} />
          {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 fadein-1">
        <StatCard title="Total Income" value={fmt(totalIncome)} icon={TrendingUp} color="green" />
        <StatCard title="Total Expense" value={fmt(totalExpense)} icon={TrendingDown} color="red" />
        <StatCard title="Net Balance" value={fmt(totalIncome - totalExpense)} icon={Wallet} color="indigo" />
        <StatCard title="Savings Rate" value={`${savingsPct}%`} icon={PiggyBank} color="yellow" subtitle="of income saved" />
      </div>

      {/* Savings progress banner */}
      {totalIncome > 0 && (
        <div
          className="relative rounded-2xl p-4 overflow-hidden fadein-2"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Savings Progress</span>
            <span className="text-xs font-bold" style={{ color: "#a5b4fc" }}>{savingsPct}% of income saved</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(savingsPct, 100)}%`,
                background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                boxShadow: "0 0 10px rgba(99,102,241,0.5)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-white/30">{fmt(savings)} saved</span>
            <span className="text-[11px] text-white/30">{fmt(totalIncome)} total income</span>
          </div>
        </div>
      )}

      {/* Charts row */}
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 fadein-2">
        {/* Pie chart */}
        <div className={glassCard}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-violet-600/5 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
          <div className="relative p-6">
            <SectionHeader dotColor="#6366f1">Expense Breakdown</SectionHeader>
            {expenseByCategory.length ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      dataKey="total"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={72}
                      innerRadius={36}
                      strokeWidth={0}
                      labelLine={false}
                      label={CustomPieLabel}
                    >
                      {expenseByCategory.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => fmt(v)}
                      contentStyle={{ background: "rgba(15,12,41,0.97)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px" }}
                      itemStyle={{ color: "#a5b4fc" }}
                      labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="mt-3 space-y-1.5">
                  {expenseByCategory.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-xs text-white/50">{item.category}</span>
                      </div>
                      <span className="text-xs font-semibold text-white/70">{fmt(item.total)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <span className="text-xl opacity-40">🍩</span>
                </div>
                <p className="text-xs text-white/25">No expense data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Area / Bar chart (2 cols) */}
        <div className={`${glassCard} lg:col-span-2`}>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-indigo-600/5 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <div className="relative p-6">
            <SectionHeader dotColor="#22c55e">Monthly Income vs Expense</SectionHeader>
            {monthlyTrend.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(v) => fmt(v)}
                    contentStyle={{ background: "rgba(15,12,41,0.97)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px" }}
                    itemStyle={{ color: "#a5b4fc" }}
                    labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                  />
                  <Legend wrapperStyle={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#incGrad)" dot={false} />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#expGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <TrendingUp size={20} className="text-emerald-400/40" />
                </div>
                <p className="text-xs text-white/25">No monthly trend data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Income vs Expense Bar chart */}
      <div className={`relative ${glassCard} fadein-3`}>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-indigo-600/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        <div className="relative p-6">
          <SectionHeader dotColor="#8b5cf6">Income vs Expense — Bar View</SectionHeader>
          {monthlyTrend.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => fmt(v)}
                  contentStyle={{ background: "rgba(15,12,41,0.97)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px" }}
                  itemStyle={{ color: "#a5b4fc" }}
                  labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                />
                <Legend wrapperStyle={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }} />
                <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <span className="text-xl opacity-40">📊</span>
              </div>
              <p className="text-xs text-white/25">No bar chart data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={`relative ${glassCard} fadein-4`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-violet-600/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />
        <div className="relative p-6">
          <SectionHeader dotColor="#6366f1">Recent Transactions</SectionHeader>

          {recentTransactions.length ? (
            <div className="space-y-1">
              {recentTransactions.map((tx) => {
                const isIncome = tx.transactionType === "income";
                const catColor = CATEGORY_COLORS[tx.category] || "#94a3b8";
                return (
                  <div
                    key={tx._id}
                    className="tx-row flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-150"
                  >
                    {/* Category dot */}
                    <div
                      className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{ background: `${catColor}18`, border: `1px solid ${catColor}30`, color: catColor }}
                    >
                      {tx.category?.[0] || "?"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/80 truncate">
                        {tx.description || tx.category}
                      </p>
                      <p className="text-[11px] text-white/30 mt-0.5">
                        {tx.category}
                        {tx.paymentMethod && (
                          <> · <span>{tx.paymentMethod}</span></>
                        )}
                        {tx.date && (
                          <> · {new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isIncome
                        ? <ArrowUpRight size={14} className="text-emerald-400" />
                        : <ArrowDownRight size={14} className="text-red-400" />}
                      <span
                        className="text-sm font-bold"
                        style={{
                          background: isIncome
                            ? "linear-gradient(90deg,#4ade80,#86efac)"
                            : "linear-gradient(90deg,#f87171,#fca5a5)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {isIncome ? "+" : "-"}{fmt(tx.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                <Wallet size={22} className="text-indigo-400/50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white/30">No recent transactions</p>
                <p className="text-xs text-white/18 mt-1">Add transactions to see them here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

