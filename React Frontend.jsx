 import { useState, useEffect, useRef } from "react";

const App = () => { const [input, setInput] = useState(""); const [messages, setMessages] = useState(() => { const saved = localStorage.getItem("tsarabot-history"); return saved ? JSON.parse(saved) : []; }); const [loading, setLoading] = useState(false); const endRef = useRef(null);

useEffect(() => { localStorage.setItem("tsarabot-history", JSON.stringify(messages)); endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

const send = async () => { if (!input.trim()) return; const userMessage = { sender: "user", text: input }; setMessages((msgs) => [...msgs, userMessage]); setInput(""); setLoading(true);

try {
  const res = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage.text }),
  });
  const data = await res.json();
  const botMessage = { sender: "bot", text: data.reply };
  setMessages((msgs) => [...msgs, botMessage]);
  speak(data.reply);
} catch {
  const offlineMsg = { sender: "bot", text: "Mode Offline: tsy misy internet." };
  setMessages((msgs) => [...msgs, offlineMsg]);
}

setLoading(false);

};

const speak = (text) => { const speech = new SpeechSynthesisUtterance(text); speech.lang = "mg-MG"; window.speechSynthesis.speak(speech); };

return ( <div className="bg-black text-white min-h-screen p-4"> <h1 className="text-orange-500 text-3xl mb-4 font-bold">Tsarabot</h1> <div className="space-y-2 max-h-[75vh] overflow-y-auto mb-4"> {messages.map((msg, i) => ( <div key={i} className={msg.sender === "user" ? "text-right" : "text-left"}> <span className={msg.sender === "user" ? "bg-orange-600 p-2 rounded-xl inline-block" : "bg-gray-700 p-2 rounded-xl inline-block"}> {msg.text} </span> </div> ))} <div ref={endRef}></div> </div> <div className="flex gap-2"> <input className="flex-1 p-2 bg-gray-800 rounded-xl text-white" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Soraty eto..." onKeyDown={(e) => e.key === "Enter" && send()} /> <button
className="bg-orange-500 px-4 rounded-xl font-bold"
onClick={send}
disabled={loading}
> Alefa </button> </div> </div> ); };

export default App;

