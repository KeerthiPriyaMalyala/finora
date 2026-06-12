import { useState, useRef, useEffect } from "react";

export default function FinoraAIChat() {
  const API_URL = "http://localhost:5000/api/chat";

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
    <div
      className="h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
      }}
    >
      {/* Header */}
      <div
        className="p-5 border-b"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
        }}
      >
        <h1 className="text-2xl font-bold text-white">
          🤖 Finora AI
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Your personal financial assistant
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
              className="max-w-[80%] px-4 py-3 rounded-2xl"
              style={{
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                    : "rgba(255,255,255,0.08)",

                border:
                  msg.role === "assistant"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",

                color: "white",
                backdropFilter: "blur(20px)",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="px-4 py-3 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "white",
              }}
            >
              Finora AI is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-5 pb-3 flex gap-2 flex-wrap">
        {[
          "Analyze my spending",
          "Budget advice",
          "Savings tips",
          "Monthly summary",
        ].map((action) => (
          <button
            key={action}
            onClick={() => setInput(action)}
            className="px-3 py-2 rounded-full text-sm"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="p-5 border-t"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Finora AI..."
            className="flex-1 px-4 py-3 rounded-xl outline-none"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{
              background:
                "linear-gradient(135deg,#6366f1,#8b5cf6)",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}