// import { useState, useRef, useEffect } from "react";

// export default function FinoraAIChat() {
//   // const API_URL = "http://localhost:5000/api/chat";



//   const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/chat`;


  
//   const [messages, setMessages] = useState([
//     {
//       role: "assistant",
//       content:
//         "👋 Hi! I'm Finora AI. Ask me about your spending, budgets, savings, or financial goals.",
//     },
//   ]);

//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim() || loading) return;

//     const userMessage = {
//       role: "user",
//       content: input,
//     };

//     setMessages((prev) => [...prev, userMessage]);

//     const currentInput = input;
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//        headers: {
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
// },

//         body: JSON.stringify({
//           message: currentInput,
//         }),
//       });

//       const data = await response.json();

//       const aiReply =
//         data.reply ||
//         data.message ||
//         data.response ||
//         "No response received.";

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: aiReply,
//         },
//       ]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content:
//             "❌ Unable to connect to Finora AI. Please try again.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       sendMessage();
//     }
//   };

//   return (
//     <div
//       className="h-screen flex flex-col"
//       style={{
//         background:
//           "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
//       }}
//     >
//       {/* Header */}
//       <div
//         className="p-5 border-b"
//         style={{
//           borderColor: "rgba(255,255,255,0.08)",
//           backdropFilter: "blur(20px)",
//         }}
//       >
//         <h1 className="text-2xl font-bold text-white">
//           🤖 Finora AI
//         </h1>

//         <p className="text-sm text-gray-400 mt-1">
//           Your personal financial assistant
//         </p>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-5 space-y-4">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.role === "user"
//                 ? "justify-end"
//                 : "justify-start"
//             }`}
//           >
//             <div
//               className="max-w-[80%] px-4 py-3 rounded-2xl"
//               style={{
//                 background:
//                   msg.role === "user"
//                     ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
//                     : "rgba(255,255,255,0.08)",

//                 border:
//                   msg.role === "assistant"
//                     ? "1px solid rgba(255,255,255,0.08)"
//                     : "none",

//                 color: "white",
//                 backdropFilter: "blur(20px)",
//               }}
//             >
//               {msg.content}
//             </div>
//           </div>
//         ))}

//         {loading && (
//           <div className="flex justify-start">
//             <div
//               className="px-4 py-3 rounded-2xl"
//               style={{
//                 background: "rgba(255,255,255,0.08)",
//                 color: "white",
//               }}
//             >
//               Finora AI is thinking...
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Quick Actions */}
//       <div className="px-5 pb-3 flex gap-2 flex-wrap">
//         {[
//           "Analyze my spending",
//           "Budget advice",
//           "Savings tips",
//           "Monthly summary",
//         ].map((action) => (
//           <button
//             key={action}
//             onClick={() => setInput(action)}
//             className="px-3 py-2 rounded-full text-sm"
//             style={{
//               background: "rgba(255,255,255,0.08)",
//               color: "white",
//               border: "1px solid rgba(255,255,255,0.08)",
//             }}
//           >
//             {action}
//           </button>
//         ))}
//       </div>

//       {/* Input */}
//       <div
//         className="p-5 border-t"
//         style={{
//           borderColor: "rgba(255,255,255,0.08)",
//         }}
//       >
//         <div className="flex gap-3">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Ask Finora AI..."
//             className="flex-1 px-4 py-3 rounded-xl outline-none"
//             style={{
//               background: "rgba(255,255,255,0.08)",
//               color: "white",
//               border: "1px solid rgba(255,255,255,0.08)",
//             }}
//           />

//           <button
//             onClick={sendMessage}
//             disabled={loading}
//             className="px-6 py-3 rounded-xl font-semibold text-white"
//             style={{
//               background:
//                 "linear-gradient(135deg,#6366f1,#8b5cf6)",
//             }}
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }






//nd













// import { useState, useRef, useEffect } from "react";
// import { Sparkles, Send } from "lucide-react";

// export default function FinoraAIChat() {
//   // const API_URL = "http://localhost:5000/api/chat";



//   const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/chat`;


  
//   const [messages, setMessages] = useState([
//     {
//       role: "assistant",
//       content:
//         "👋 Hi! I'm Finora AI. Ask me about your spending, budgets, savings, or financial goals.",
//     },
//   ]);

//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim() || loading) return;

//     const userMessage = {
//       role: "user",
//       content: input,
//     };

//     setMessages((prev) => [...prev, userMessage]);

//     const currentInput = input;
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//        headers: {
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
// },

//         body: JSON.stringify({
//           message: currentInput,
//         }),
//       });

//       const data = await response.json();

//       const aiReply =
//         data.reply ||
//         data.message ||
//         data.response ||
//         "No response received.";

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: aiReply,
//         },
//       ]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content:
//             "❌ Unable to connect to Finora AI. Please try again.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       sendMessage();
//     }
//   };

//   return (
//     <div className="relative h-screen flex flex-col bg-[#080B14] overflow-hidden">

//       {/* ambient glows */}
//       <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-amber-400/10 blur-[110px]" />
//       <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-teal-400/10 blur-[110px]" />

//       {/* fine grid texture */}
//       <div
//         className="pointer-events-none absolute inset-0 opacity-[0.05]"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
//           backgroundSize: "48px 48px",
//         }}
//       />

//       {/* Header */}
//       <div className="relative z-10 px-4 py-4 sm:px-6 sm:py-5 border-b border-white/[0.07] backdrop-blur-xl">
//         <div className="flex items-center gap-2.5">
//           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 ring-1 ring-teal-400/30">
//             <Sparkles className="h-4 w-4 text-teal-300" />
//           </div>
//           <div>
//             <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
//               Finora AI
//             </h1>
//             <p className="text-xs sm:text-sm text-slate-400 -mt-0.5">
//               Your personal financial assistant
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="relative z-10 flex-1 overflow-y-auto px-4 py-5 sm:px-6 space-y-3 sm:space-y-4">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.role === "user"
//                 ? "justify-end"
//                 : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm sm:text-[15px] leading-relaxed ${
//                 msg.role === "user"
//                   ? "bg-teal-400 text-[#062024] font-medium"
//                   : "bg-white/[0.05] border border-white/[0.08] text-slate-100 backdrop-blur-xl"
//               }`}
//             >
//               {msg.content}
//             </div>
//           </div>
//         ))}

//         {loading && (
//           <div className="flex justify-start">
//             <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl">
//               <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse [animation-delay:-0.3s]" />
//               <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse [animation-delay:-0.15s]" />
//               <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse" />
//               <span className="ml-2 text-sm text-slate-300">Finora AI is thinking...</span>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Quick Actions */}
//       <div className="relative z-10 px-4 pb-3 sm:px-6 flex gap-2 flex-wrap">
//         {[
//           "Analyze my spending",
//           "Budget advice",
//           "Savings tips",
//           "Monthly summary",
//         ].map((action) => (
//           <button
//             key={action}
//             onClick={() => setInput(action)}
//             className="px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-teal-100 bg-teal-400/[0.08] border border-teal-400/20 hover:bg-teal-400/[0.14] transition-colors"
//           >
//             {action}
//           </button>
//         ))}
//       </div>

//       {/* Input */}
//       <div className="relative z-10 px-4 py-4 sm:px-6 sm:py-5 border-t border-white/[0.07] backdrop-blur-xl">
//         <div className="flex gap-2.5 sm:gap-3">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Ask Finora AI..."
//             className="flex-1 min-w-0 px-4 py-3 rounded-xl outline-none text-sm sm:text-base text-white placeholder:text-slate-500 bg-white/[0.05] border border-white/[0.08] transition-all duration-200 focus:border-teal-400/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-teal-400/10"
//           />

//           <button
//             onClick={sendMessage}
//             disabled={loading}
//             className="shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base text-[#062024] bg-teal-400 hover:bg-teal-300 transition-all duration-200 disabled:opacity-60"
//           >
//             <span className="hidden sm:inline">Send</span>
//             <Send className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }











//nd22222222











import { useState, useRef, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";

export default function FinoraAIChat() {
  // const API_URL = "http://localhost:5000/api/chat";



  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/chat`;


  
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm Finora AI. Ask me about your spending, budgets, savings, or financial goals.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
       headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
},

        body: JSON.stringify({
          message: currentInput,
        }),
      });

      const data = await response.json();

      const aiReply =
        data.reply ||
        data.message ||
        data.response ||
        "No response received.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiReply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "❌ Unable to connect to Finora AI. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="relative flex flex-col overflow-hidden bg-[#080B14]" style={{ height: "100dvh" }}>

      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-amber-400/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-teal-400/10 blur-[110px]" />

      {/* fine grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Header */}
      <div className="relative z-10 shrink-0 px-4 py-4 sm:px-6 sm:py-5 border-b border-white/[0.07] backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 ring-1 ring-teal-400/30">
            <Sparkles className="h-4 w-4 text-teal-300" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
              Finora AI
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 -mt-0.5">
              Your personal financial assistant
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto px-4 py-5 sm:px-6 space-y-3 sm:space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm sm:text-[15px] leading-relaxed break-words whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-teal-400 text-[#062024] font-medium"
                  : "bg-white/[0.05] border border-white/[0.08] text-slate-100 backdrop-blur-xl"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse" />
              <span className="ml-2 text-sm text-slate-300">Finora AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="relative z-10 shrink-0 px-4 pb-3 sm:px-6 flex gap-2 flex-wrap">
        {[
          "Analyze my spending",
          "Budget advice",
          "Savings tips",
          "Monthly summary",
        ].map((action) => (
          <button
            key={action}
            onClick={() => setInput(action)}
            className="px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-teal-100 bg-teal-400/[0.08] border border-teal-400/20 hover:bg-teal-400/[0.14] transition-colors"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="relative z-10 shrink-0 px-4 py-4 sm:px-6 sm:py-5 border-t border-white/[0.07] backdrop-blur-xl">
        <div className="flex gap-2.5 sm:gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Finora AI..."
            className="flex-1 min-w-0 px-4 py-3 rounded-xl outline-none text-sm sm:text-base text-white placeholder:text-slate-500 bg-white/[0.05] border border-white/[0.08] transition-all duration-200 focus:border-teal-400/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-teal-400/10"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base text-[#062024] bg-teal-400 hover:bg-teal-300 transition-all duration-200 disabled:opacity-60"
          >
            <span className="hidden sm:inline">Send</span>
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}