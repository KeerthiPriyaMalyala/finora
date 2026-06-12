

import { LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header
      className="h-16 flex items-center justify-between px-6 relative overflow-hidden z-10"
      style={{
        background: "rgba(10,8,24,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(99,102,241,0.12)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
      }}
    >
      <style>{`
        @keyframes glowPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        .logout-btn { transition: all 0.2s ease; }
        .logout-btn:hover { background: rgba(239,68,68,0.12); color: #f87171; border-color: rgba(239,68,68,0.25); transform: translateY(-1px); }
        .logout-btn:active { transform: translateY(0); }
        .nav-dot { animation: glowPulse 2.5s ease-in-out infinite; }
      `}</style>

      {/* Top accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-64 h-16 rounded-full bg-indigo-600/10 blur-2xl" />

      {/* Logo */}
      <div className="flex items-center gap-2.5 relative">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 0 14px rgba(99,102,241,0.55)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
        <span
          className="text-lg font-bold tracking-tight"
          style={{ background: "linear-gradient(90deg, #a5b4fc, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          Finora
        </span>
        <span className="nav-dot w-1.5 h-1.5 rounded-full bg-indigo-400 ml-0.5" style={{ boxShadow: "0 0 6px rgba(99,102,241,0.8)" }} />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 relative">
        {/* User pill */}
        <div
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl"
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.18)",
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            <User size={13} className="text-indigo-400" />
          </div>
          <span className="hidden sm:inline text-sm font-medium text-white/60 max-w-[140px] truncate">
            {user?.email}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-white/[0.08] hidden sm:block" />

        {/* Logout */}
        <button
          onClick={logout}
          className="logout-btn flex items-center gap-1.5 text-sm font-medium text-white/35 px-3 py-1.5 rounded-xl border border-transparent"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
