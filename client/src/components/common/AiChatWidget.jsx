import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import { api } from "../../services/api.js";

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm the FurShield care assistant. Ask me anything about feeding, grooming, vaccinations or general pet care." },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = async (e) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/ask", { question: q });
      setMessages((m) => [...m, { role: "assistant", text: data.data.answer || "Sorry, I couldn't find an answer." }]);
    } catch (err) {
      const msg = err.response?.data?.message || "The assistant is unavailable right now.";
      setMessages((m) => [...m, { role: "assistant", text: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-80 sm:w-96 h-[28rem] bg-white rounded-2xl shadow-2xl border border-sand flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-forest to-emerald px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-cream font-semibold text-sm">
              <Sparkles size={16} className="text-golden" /> FurShield Care Assistant
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-cream/80 hover:text-cream">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-sand/30">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "user" ? "bg-emerald text-white ml-auto rounded-br-sm" : "bg-white text-ink shadow-sm rounded-bl-sm"}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="bg-white text-muted shadow-sm rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm max-w-[85%] flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Thinking...
              </div>
            )}
          </div>

          <form onSubmit={send} className="p-3 border-t border-sand flex items-center gap-2 shrink-0">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about feeding, vaccines..."
              className="flex-1 border border-sand rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald"
            />
            <button type="submit" disabled={loading} className="w-9 h-9 rounded-full bg-emerald text-white flex items-center justify-center shrink-0 disabled:opacity-50" aria-label="Send message">
              <Send size={15} />
            </button>
          </form>
          <p className="text-[10px] text-muted text-center pb-2 px-3">Not a substitute for professional veterinary advice.</p>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-emerald hover:bg-forest text-white shadow-xl flex items-center justify-center transition-colors"
        aria-label="Open pet-care assistant"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
