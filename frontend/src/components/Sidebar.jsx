
// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Receipt,
//   PiggyBank,
//   QrCode,
//   Bot
// } from "lucide-react";
// const links = [
//   { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
//   { to: "/expenses", label: "Expenses", icon: Receipt },
//   { to: "/budget", label: "Budget", icon: PiggyBank },
  
//    { to: "/ai-chat", label: "Finora AI", icon: Bot },
// { to: "/qr-pay", label: "Scan & Pay", icon: QrCode }
//   // ✅ NEW PAGE
// ];

// export function Sidebar() {
//   return (
//     <aside
//       className="w-56 shrink-0 min-h-screen flex flex-col py-6 px-3 relative overflow-hidden"
//       style={{
//         background: "linear-gradient(180deg, #0a0818 0%, #0f0c29 60%, #0a0818 100%)",
//         borderRight: "1px solid rgba(99,102,241,0.12)",
//       }}
//     >
//       <style>{`
//         @keyframes glowPulse { 0%,100%{opacity:.4} 50%{opacity:1} }
//         @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
//         .sidebar-link { transition: all 0.22s cubic-bezier(.4,0,.2,1); }
//         .sidebar-link:hover .link-icon { transform: scale(1.1); }
//         .link-icon { transition: transform 0.2s ease; }
//         .glow-orb { animation: glowPulse 3s ease-in-out infinite; }
//         .nav-item { animation: slideIn 0.35s ease both; }
//       `}</style>

//       {/* Background orbs */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="glow-orb absolute -top-10 -left-10 w-40 h-40 rounded-full bg-indigo-600/20 blur-3xl" />
//         <div className="glow-orb absolute bottom-20 -right-6 w-32 h-32 rounded-full bg-violet-600/15 blur-2xl" style={{ animationDelay: "1.5s" }} />
//       </div>

//       {/* Top accent line */}
//       <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

//       {/* Logo */}
//       <div className="relative mb-8 px-3">
//         <div className="flex items-center gap-2.5 mb-1">
//           <div
//             className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
//             style={{
//               background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
//               boxShadow: "0 0 12px rgba(99,102,241,0.5)",
//             }}
//           >
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
//               <polyline points="16 7 22 7 22 13" />
//             </svg>
//           </div>
//           <span
//             className="text-lg font-bold tracking-tight"
//             style={{ background: "linear-gradient(90deg, #a5b4fc, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
//           >
//             Finora
//           </span>
//         </div>
//         <p className="text-[11px] text-white/25 pl-[38px] font-medium tracking-widest uppercase">
//           Finance Manager
//         </p>
//       </div>

//       {/* Section label */}
//       <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] px-3 mb-2">
//         Navigation
//       </p>

//       {/* Nav links */}
//       <nav className="flex flex-col gap-1 relative">
//         {links.map(({ to, label, icon: Icon }, i) => (
//           <NavLink key={to} to={to} className="nav-item" style={{ animationDelay: `${i * 0.07}s` }}>
//             {({ isActive }) => (
//               <span
//                 className="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium relative overflow-hidden"
//                 style={
//                   isActive
//                     ? {
//                         background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))",
//                         border: "1px solid rgba(99,102,241,0.35)",
//                         color: "#a5b4fc",
//                         boxShadow:
//                           "0 0 16px rgba(99,102,241,0.2), inset 0 0 16px rgba(99,102,241,0.05)",
//                       }
//                     : {
//                         color: "rgba(255,255,255,0.35)",
//                         border: "1px solid transparent",
//                       }
//                 }
//               >
//                 {isActive && (
//                   <span
//                     className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-indigo-400"
//                     style={{ boxShadow: "0 0 8px rgba(99,102,241,0.8)" }}
//                   />
//                 )}

//                 <span className="link-icon">
//                   <Icon size={16} />
//                 </span>

//                 {label}
//               </span>
//             )}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Bottom fade */}
//       <div
//         className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
//         style={{ background: "linear-gradient(to top, rgba(10,8,24,0.8), transparent)" }}
//       />
//     </aside>
//   );
// }









//nd








import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  QrCode,
  Bot,
  Menu,
  X,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/budget", label: "Budget", icon: PiggyBank },
  
   { to: "/ai-chat", label: "Finora AI", icon: Bot },
{ to: "/qr-pay", label: "Scan & Pay", icon: QrCode }
  // ✅ NEW PAGE
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{`
        @keyframes glowPulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        .sidebar-link { transition: all 0.22s cubic-bezier(.4,0,.2,1); }
        .sidebar-link:hover .link-icon { transform: scale(1.1); }
        .link-icon { transition: transform 0.2s ease; }
        .glow-orb { animation: glowPulse 3s ease-in-out infinite; }
        .nav-item { animation: slideIn 0.35s ease both; }
      `}</style>

      {/* Mobile top bar with hamburger */}
      <div
        className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: "rgba(8,11,20,0.85)",
          borderColor: "rgba(45,212,191,0.12)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #2dd4bf, #f59e0b)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#062024" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <span
            className="text-base font-bold tracking-tight"
            style={{ background: "linear-gradient(90deg,#5eead4,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Finora
          </span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg text-teal-200"
          style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)" }}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar / drawer */}
      <aside
        className={`
          w-64 lg:w-56 shrink-0 min-h-screen flex flex-col py-6 px-3 relative overflow-hidden
          fixed lg:static inset-y-0 left-0 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
        style={{
          background: "linear-gradient(180deg, #080B14 0%, #0c1420 60%, #080B14 100%)",
          borderRight: "1px solid rgba(45,212,191,0.12)",
        }}
      >
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="glow-orb absolute -top-10 -left-10 w-40 h-40 rounded-full bg-teal-500/15 blur-3xl" />
          <div className="glow-orb absolute bottom-20 -right-6 w-32 h-32 rounded-full bg-amber-500/12 blur-2xl" style={{ animationDelay: "1.5s" }} />
        </div>

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

        {/* Mobile close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-3 p-1.5 rounded-lg text-white/40 hover:text-white/80 transition-colors z-10"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>

        {/* Logo */}
        <div className="relative mb-8 px-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #2dd4bf, #f59e0b)",
                boxShadow: "0 0 12px rgba(45,212,191,0.5)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#062024" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{ background: "linear-gradient(90deg, #5eead4, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Finora
            </span>
          </div>
          <p className="text-[11px] text-white/25 pl-[38px] font-medium tracking-widest uppercase">
            Finance Manager
          </p>
        </div>

        {/* Section label */}
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] px-3 mb-2">
          Navigation
        </p>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 relative">
          {links.map(({ to, label, icon: Icon }, i) => (
            <NavLink
              key={to}
              to={to}
              className="nav-item"
              style={{ animationDelay: `${i * 0.07}s` }}
              onClick={() => setIsOpen(false)}
            >
              {({ isActive }) => (
                <span
                  className="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium relative overflow-hidden"
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(135deg, rgba(45,212,191,0.22), rgba(245,158,11,0.12))",
                          border: "1px solid rgba(45,212,191,0.35)",
                          color: "#5eead4",
                          boxShadow:
                            "0 0 16px rgba(45,212,191,0.18), inset 0 0 16px rgba(45,212,191,0.05)",
                        }
                      : {
                          color: "rgba(255,255,255,0.35)",
                          border: "1px solid transparent",
                        }
                  }
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-teal-400"
                      style={{ boxShadow: "0 0 8px rgba(45,212,191,0.8)" }}
                    />
                  )}

                  <span className="link-icon">
                    <Icon size={16} />
                  </span>

                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(8,11,20,0.8), transparent)" }}
        />
      </aside>
    </>
  );
}