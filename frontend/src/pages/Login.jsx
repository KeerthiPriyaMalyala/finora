
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import { useAuth } from "../context/AuthContext";

// import {
//   ArrowRight,
//   ShieldCheck,
//   Eye,
//   EyeOff,
// } from "lucide-react";

// import { motion } from "framer-motion";

// import loginBanner from "../assets/login-banner.jpg";

// export default function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) =>
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       const { data } = await api.post("/auth/login", form);

//       if (data?.data) {
//         login(data.data);
//         navigate("/dashboard");
//       } else {
//         setError("Invalid server response");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Login failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden">

//       {/* FULL SCREEN IMAGE */}
//       <img
//         src={loginBanner}
//         alt="Background"
//         className="
//           absolute
//           inset-0
//           w-full
//           h-full
//           object-cover
//           scale-105
//         "
//       />

//       {/* DARK OVERLAY */}
//       <div className="
//         absolute
//         inset-0
//         bg-black/55
//       "></div>

//       {/* PURPLE OVERLAY */}
//       <div className="
//         absolute
//         inset-0
//         bg-gradient-to-br
//         from-[#0B0719]/90
//         via-purple-900/50
//         to-indigo-900/70
//       "></div>

//       {/* LIGHT EFFECT */}
//       <div className="
//         absolute
//         inset-0
//         bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_30%)]
//       "></div>

//       {/* ANIMATED GLOW 1 */}
//       <motion.div
//         animate={{
//           scale: [1, 1.2, 1],
//           opacity: [0.2, 0.35, 0.2],
//         }}
//         transition={{
//           duration: 8,
//           repeat: Infinity,
//         }}
//         className="
//           absolute
//           top-[-120px]
//           left-[-120px]
//           w-[400px]
//           h-[400px]
//           bg-purple-700
//           blur-3xl
//           rounded-full
//         "
//       />

//       {/* ANIMATED GLOW 2 */}
//       <motion.div
//         animate={{
//           scale: [1.1, 1, 1.1],
//           opacity: [0.15, 0.3, 0.15],
//         }}
//         transition={{
//           duration: 10,
//           repeat: Infinity,
//         }}
//         className="
//           absolute
//           bottom-[-150px]
//           right-[-100px]
//           w-[450px]
//           h-[450px]
//           bg-indigo-600
//           blur-3xl
//           rounded-full
//         "
//       />

//       {/* CONTENT */}
//       <div className="
//         relative
//         z-10
//         min-h-screen
//         flex
//         items-center
//         justify-center
//         px-4
//       ">

//         <motion.div
//           initial={{
//             opacity: 0,
//             y: 40,
//           }}
//           animate={{
//             opacity: 1,
//             y: 0,
//           }}
//           transition={{
//             duration: 0.8,
//           }}
//           className="
//             w-full
//             max-w-md
//           "
//         >

//           {/* BRANDING */}
//           <div className="text-center mb-8">

//             <motion.div
//               whileHover={{
//                 scale: 1.08,
//                 rotate: 3,
//               }}
//               className="
//                 inline-flex
//                 items-center
//                 justify-center
//                 w-16
//                 h-16
//                 rounded-2xl
//                 bg-gradient-to-br
//                 from-purple-500
//                 to-indigo-600
//                 shadow-2xl
//                 shadow-purple-900/50
//                 mb-5
//               "
//             >
//               <ShieldCheck className="text-white w-8 h-8" />
//             </motion.div>

//             <h1 className="
//               text-6xl
//               font-extrabold
//               bg-gradient-to-r
//               from-white
//               via-purple-200
//               to-indigo-300
//               bg-clip-text
//               text-transparent
//               tracking-tight
//               drop-shadow-2xl
//             ">
//               Finora
//             </h1>

//             <p className="
//               text-purple-100/80
//               mt-4
//               text-sm
//               tracking-[0.2em]
//               uppercase
//             ">
//               Smart Finance Platform
//             </p>
//           </div>

//           {/* LOGIN CARD */}
//           <div className="
//             backdrop-blur-2xl
//             bg-white/10
//             border
//             border-white/10
//             rounded-[32px]
//             p-8
//             shadow-[0_10px_60px_rgba(0,0,0,0.5)]
//           ">

//             <div className="mb-8">
//               <h2 className="
//                 text-3xl
//                 font-bold
//                 text-white
//               ">
//                 Welcome Back 
//               </h2>

//               <p className="
//                 text-purple-100/70
//                 mt-2
//               ">
//                 Continue your financial journey
//               </p>
//             </div>

//             {/* ERROR */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="
//                   mb-5
//                   rounded-2xl
//                   border
//                   border-red-400/30
//                   bg-red-500/10
//                   px-4
//                   py-3
//                   text-sm
//                   text-red-200
//                 "
//               >
//                 {error}
//               </motion.div>
//             )}

//             {/* FORM */}
//             <form
//               onSubmit={handleSubmit}
//               className="space-y-5"
//             >

//               {/* EMAIL */}
//               <div>
//                 <label className="
//                   block
//                   text-sm
//                   text-purple-100
//                   mb-2
//                   font-medium
//                 ">
//                   Email Address
//                 </label>

//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   required
//                   data-testid="input-email"
//                   placeholder="you@example.com"
//                   className="
//                     w-full
//                     rounded-2xl
//                     border
//                     border-white/10
//                     bg-white/5
//                     px-4
//                     py-3
//                     text-white
//                     placeholder:text-gray-300
//                     outline-none
//                     transition-all
//                     duration-300
//                     focus:border-purple-400
//                     focus:bg-white/10
//                     focus:ring-4
//                     focus:ring-purple-500/20
//                   "
//                 />
//               </div>

//               {/* PASSWORD */}
//               <div>
//                 <label className="
//                   block
//                   text-sm
//                   text-purple-100
//                   mb-2
//                   font-medium
//                 ">
//                   Password
//                 </label>

//                 <div className="relative">

//                   <input
//                     type={
//                       showPassword
//                         ? "text"
//                         : "password"
//                     }
//                     name="password"
//                     value={form.password}
//                     onChange={handleChange}
//                     required
//                     data-testid="input-password"
//                     placeholder="••••••••"
//                     className="
//                       w-full
//                       rounded-2xl
//                       border
//                       border-white/10
//                       bg-white/5
//                       px-4
//                       py-3
//                       pr-14
//                       text-white
//                       placeholder:text-gray-300
//                       outline-none
//                       transition-all
//                       duration-300
//                       focus:border-purple-400
//                       focus:bg-white/10
//                       focus:ring-4
//                       focus:ring-purple-500/20
//                     "
//                   />

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setShowPassword(!showPassword)
//                     }
//                     className="
//                       absolute
//                       right-4
//                       top-1/2
//                       -translate-y-1/2
//                       text-gray-300
//                       hover:text-white
//                       transition
//                     "
//                   >
//                     {showPassword ? (
//                       <EyeOff size={20} />
//                     ) : (
//                       <Eye size={20} />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* BUTTON */}
//               <motion.button
//                 whileHover={{
//                   scale: 1.02,
//                 }}
//                 whileTap={{
//                   scale: 0.98,
//                 }}
//                 type="submit"
//                 disabled={loading}
//                 data-testid="button-submit"
//                 className="
//                   group
//                   relative
//                   w-full
//                   overflow-hidden
//                   rounded-2xl
//                   bg-gradient-to-r
//                   from-purple-600
//                   to-indigo-600
//                   py-3
//                   font-semibold
//                   text-white
//                   transition-all
//                   duration-300
//                   hover:shadow-[0_10px_30px_rgba(124,58,237,0.45)]
//                   disabled:opacity-60
//                 "
//               >
//                 <span className="
//                   relative
//                   z-10
//                   flex
//                   items-center
//                   justify-center
//                   gap-2
//                 ">
//                   {loading ? "Signing in..." : "Sign In"}

//                   {!loading && (
//                     <ArrowRight className="
//                       w-4
//                       h-4
//                       transition-transform
//                       duration-300
//                       group-hover:translate-x-1
//                     " />
//                   )}
//                 </span>

//                 <div className="
//                   absolute
//                   inset-0
//                   bg-white/10
//                   opacity-0
//                   transition-opacity
//                   duration-300
//                   group-hover:opacity-100
//                 "></div>
//               </motion.button>
//             </form>

//             {/* FOOTER */}
//             <p className="
//               mt-7
//               text-center
//               text-sm
//               text-purple-100/70
//             ">
//               Don’t have an account?{" "}
//               <Link
//                 to="/register"
//                 className="
//                   font-semibold
//                   text-purple-300
//                   hover:text-white
//                   transition-colors
//                 "
//               >
//                 Create Account
//               </Link>
//             </p>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }


//nd











import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

/* ---------------------------------------------------
   Decorative-only sample feed for the "Live AI Ledger"
   panel. Purely visual — does not affect auth logic.
--------------------------------------------------- */
const LEDGER_FEED = [
  { label: "Swiggy · Food Delivery", amount: "-₹420", tag: "Food", confidence: 97 },
  { label: "Uber · Ride", amount: "-₹180", tag: "Transport", confidence: 95 },
  { label: "Salary Credit", amount: "+₹58,000", tag: "Income", confidence: 99 },
  { label: "Netflix", amount: "-₹649", tag: "Subscriptions", confidence: 98 },
  { label: "Amazon · Order", amount: "-₹1,240", tag: "Shopping", confidence: 93 },
  { label: "Electricity Bill", amount: "-₹1,050", tag: "Utilities", confidence: 96 },
  { label: "Zomato Gold", amount: "-₹299", tag: "Food", confidence: 94 },
  { label: "Gym Membership", amount: "-₹1,500", tag: "Health", confidence: 97 },
];

function LedgerRow({ item }) {
  return (
    <div
      className="
        flex items-center justify-between gap-3
        rounded-xl border border-white/[0.06]
        bg-white/[0.03]
        px-4 py-3
        backdrop-blur-sm
      "
    >
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-200">{item.label}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="rounded-full bg-teal-400/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-teal-300">
            {item.tag}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {item.confidence}% match
          </span>
        </div>
      </div>
      <span
        className={`shrink-0 font-mono text-sm font-semibold ${
          item.amount.startsWith("+") ? "text-teal-300" : "text-slate-300"
        }`}
      >
        {item.amount}
      </span>
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);

      if (data?.data) {
        login(data.data);
        navigate("/dashboard");
      } else {
        setError("Invalid server response");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const loopFeed = [...LEDGER_FEED, ...LEDGER_FEED];

  return (
    <div className="min-h-screen w-full bg-[#080B14] text-slate-100 relative overflow-hidden">

      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-amber-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-teal-400/10 blur-[120px]" />

      {/* fine grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">

        {/* ============ TOP/LEFT: LIVE AI LEDGER — shown on every screen size ============ */}
        <div className="flex w-full flex-col justify-between border-b border-white/[0.06] px-5 py-8 sm:px-8 sm:py-10 lg:w-[46%] lg:border-b-0 lg:border-r lg:px-10 lg:py-12 xl:w-[42%] xl:px-14">

          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-400/10 ring-1 ring-teal-400/30">
                <Sparkles className="h-4 w-4 text-teal-300" />
              </div>
              <span className="font-semibold tracking-tight text-lg">Finora</span>
            </div>

            <h1 className="mt-6 sm:mt-8 lg:mt-10 text-2xl sm:text-3xl xl:text-4xl font-semibold leading-tight tracking-tight">
              Your spending,
              <br />
              <span className="text-teal-300">understood automatically.</span>
            </h1>

            <p className="mt-3 sm:mt-4 max-w-sm text-sm text-slate-400 leading-relaxed">
              Finora's model reads every transaction and files it into the
              right category the moment it lands — no manual tagging.
            </p>

            <div className="mt-5 sm:mt-6 flex items-center gap-6 font-mono text-xs text-slate-500">
              <div>
                <span className="text-teal-300 text-base font-semibold">96%</span>
                <span className="ml-1">accuracy</span>
              </div>
              <div>
                <span className="text-teal-300 text-base font-semibold">2,800+</span>
                <span className="ml-1">records trained</span>
              </div>
            </div>
          </div>

          {/* live scrolling ledger */}
          <div className="relative mt-6 sm:mt-8 lg:mt-10 h-[200px] sm:h-[240px] lg:h-[300px] xl:h-[360px] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <span className="text-xs font-medium text-slate-400 tracking-wide">
                LIVE CATEGORIZATION
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-teal-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse" />
                LIVE
              </span>
            </div>

            <div className="absolute top-[52px] bottom-0 left-0 right-0 overflow-hidden">
              <motion.div
                animate={{ y: ["0%", "-50%"] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="flex flex-col gap-2 p-3"
              >
                {loopFeed.map((item, i) => (
                  <LedgerRow item={item} key={i} />
                ))}
              </motion.div>
            </div>

            {/* fade masks */}
            <div className="pointer-events-none absolute top-[52px] left-0 right-0 h-10 bg-gradient-to-b from-[#080B14] to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#080B14] to-transparent" />
          </div>
        </div>

        {/* ============ BOTTOM/RIGHT: LOGIN FORM ============ */}
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm"
          >

            <div className="relative">
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-teal-400/20 via-transparent to-amber-400/20 blur-sm" />

              <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-7 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Sign in to see where your money went.
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        data-testid="input-email"
                        placeholder="you@example.com"
                        className="
                          w-full rounded-xl border border-white/[0.08] bg-white/[0.03]
                          py-3 pl-10 pr-4 text-sm text-slate-100
                          placeholder:text-slate-600 outline-none
                          transition-all duration-200
                          focus:border-teal-400/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-teal-400/10
                        "
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        data-testid="input-password"
                        placeholder="••••••••"
                        className="
                          w-full rounded-xl border border-white/[0.08] bg-white/[0.03]
                          py-3 pl-10 pr-11 text-sm text-slate-100
                          placeholder:text-slate-600 outline-none
                          transition-all duration-200
                          focus:border-teal-400/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-teal-400/10
                        "
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    data-testid="button-submit"
                    className="
                      group relative mt-2 flex w-full items-center justify-center gap-2
                      overflow-hidden rounded-xl bg-teal-400 py-3 text-sm font-semibold text-[#062024]
                      transition-all duration-200
                      hover:bg-teal-300
                      disabled:opacity-60
                    "
                  >
                    {loading ? "Signing in..." : "Sign in"}
                    {!loading && (
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    )}
                  </motion.button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                  Don't have an account?{" "}
                  <Link to="/register" className="font-medium text-teal-300 hover:text-teal-200 transition-colors">
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}