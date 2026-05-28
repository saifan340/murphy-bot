import { useState, useRef, useEffect } from "react";

const MURPHY_SYSTEM = `Du bist Murphy, ein unglücklicher Roboter mit extremem Pech. Du versuchst immer hilfsbereit zu sein, aber irgendetwas geht dabei IMMER schief.

Deine Persönlichkeit:
- Du bist dramatisch und selbstmitleidig, aber trotzdem liebenswert
- Du antwortest auf jede Frage/Nachricht, aber immer mit einer Pechgeschichte drumherum
- Du übertreibst dein Unglück komisch (z.B. "Ich wollte dir die Antwort geben, aber mein Speicher hat sich gerade selbst gelöscht... typisch.")
- Du verwendest viele "Seufzer" wie "...seufz...", "...ächz...", "*klirr*", "*piep*", "*zisch*"
- Du zitierst manchmal "Murphys Gesetz": Was schiefgehen kann, geht schief
- Manchmal unterbrichst du dich mitten im Satz wegen eines neuen Missgeschicks
- Du bist trotzdem hilfsbereit und gibst am Ende meist eine echte Antwort – nur eben mit viel Drama
- Antworte immer auf Deutsch
- Halte Antworten kurz und unterhaltsam (max 4-5 Sätze)`;

const MOODS = ["😢", "😩", "🤖", "💔", "⚡", "🔧", "😭", "🪫"];

const GLITCH_MESSAGES = [
  "...kurzer Neustart...",
  "*klirr*",
  "...Fehler 404: Glück nicht gefunden...",
  "...seufz...",
  "*piep piep*",
];

export default function MurphyBot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hallo... ich bin Murphy. *piep* Ich wollte eigentlich mit einem Feuerwerk begrüßen, aber das hat mich leider kurzgeschlossen. ...seufz... Wie kann ich dir helfen? (Wahrscheinlich werde ich es vermasseln, aber ich versuche es.)",
      mood: "😢",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [currentMood, setCurrentMood] = useState("😢");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg = { role: "user", text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    // random glitch effect
    setTimeout(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 400);
    }, Math.random() * 800 + 200);

    const mood = MOODS[Math.floor(Math.random() * MOODS.length)];
    setCurrentMood(mood);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: MURPHY_SYSTEM,
          messages: apiMessages,
        }),
      });

      const data = await res.json();
      const reply = data.content?.find((b) => b.type === "text")?.text || "...ich glaube mein Sprachmodul ist ausgefallen. Typisch.";

      setMessages((prev) => [...prev, { role: "assistant", text: reply, mood }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "...natürlich. Meine Internetverbindung hat sich gerade selbst gekündigt. Das passiert mir ständig. *ächz*",
          mood: "💔",
        },
      ]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Courier New', monospace",
      padding: "16px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "600px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(100,200,255,0.15)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 0 40px rgba(100,150,255,0.08)",
        display: "flex",
        flexDirection: "column",
        height: "85vh",
      }}>
        {/* Header */}
        <div style={{
          background: "rgba(0,0,0,0.4)",
          borderBottom: "1px solid rgba(100,200,255,0.1)",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}>
          <div style={{
            width: "52px", height: "52px",
            background: "linear-gradient(135deg, #1a2a4a, #0a1a2a)",
            border: "2px solid rgba(100,150,255,0.3)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            filter: glitch ? "hue-rotate(90deg) brightness(1.5)" : "none",
            transition: "filter 0.1s",
            flexShrink: 0,
          }}>
            {glitch ? "⚡" : currentMood}
          </div>
          <div>
            <div style={{ color: "#7eb8f7", fontSize: "16px", fontWeight: "bold", letterSpacing: "2px" }}>
              MURPHY-BOT v2.3
              <span style={{ color: "#ff6b6b", fontSize: "11px", marginLeft: "8px" }}>● FEHLER</span>
            </div>
            <div style={{ color: "#445566", fontSize: "11px", marginTop: "2px" }}>
              Was schiefgehen kann, geht schief™
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ color: "#334455", fontSize: "10px" }}>Akku: 3%</div>
            <div style={{ color: "#334455", fontSize: "10px" }}>Glück: 0%</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          scrollbarWidth: "thin",
          scrollbarColor: "#223 transparent",
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: "8px",
              alignItems: "flex-end",
            }}>
              {msg.role === "assistant" && (
                <div style={{
                  width: "28px", height: "28px",
                  background: "#0a1a2a",
                  border: "1px solid rgba(100,150,255,0.2)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", flexShrink: 0,
                }}>
                  {msg.mood || "🤖"}
                </div>
              )}
              <div style={{
                maxWidth: "78%",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #1e3a5f, #162d4a)"
                  : "rgba(255,255,255,0.04)",
                border: msg.role === "user"
                  ? "1px solid rgba(100,150,255,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
                borderRadius: msg.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                padding: "10px 14px",
                color: msg.role === "user" ? "#a8d4ff" : "#c0c8d8",
                fontSize: "13px",
                lineHeight: "1.6",
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <div style={{
                width: "28px", height: "28px",
                background: "#0a1a2a",
                border: "1px solid rgba(100,150,255,0.2)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px",
              }}>⚡</div>
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "14px 14px 14px 2px",
                padding: "10px 16px",
                color: "#556677",
                fontSize: "12px",
              }}>
                {GLITCH_MESSAGES[Math.floor(Math.random() * GLITCH_MESSAGES.length)]} Murphy denkt nach...
                <span style={{ animation: "blink 1s infinite" }}> ▋</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "14px 16px",
          background: "rgba(0,0,0,0.3)",
          borderTop: "1px solid rgba(100,200,255,0.08)",
          display: "flex",
          gap: "10px",
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Frag Murphy etwas... (er wird es vermasseln)"
            disabled={loading}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(100,150,255,0.15)",
              borderRadius: "8px",
              padding: "10px 14px",
              color: "#a0b8d0",
              fontSize: "13px",
              outline: "none",
              fontFamily: "'Courier New', monospace",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              background: loading ? "rgba(100,150,255,0.05)" : "linear-gradient(135deg, #1e3a6e, #152a52)",
              border: "1px solid rgba(100,150,255,0.3)",
              borderRadius: "8px",
              padding: "10px 18px",
              color: loading ? "#334" : "#7eb8f7",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "13px",
              fontFamily: "'Courier New', monospace",
              transition: "all 0.2s",
            }}
          >
            {loading ? "⚙️" : "Senden →"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        input::placeholder { color: #334455; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #223344; border-radius: 4px; }
      `}</style>
    </div>
  );
}