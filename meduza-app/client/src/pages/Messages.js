import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Messages = () => {
  const [messages, setMessages] = useState([
    { id: 1, from: "dr Kowalski", text: "Proszę o wykonanie badań." },
  ]);
  const [text, setText] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setMessages([...messages, { id: Date.now(), from: "Ja", text }]);
    setText("");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center pt-[65px] text-white"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
      }}
    >
      <Navbar />
      <div className="bg-black/70 p-6 rounded-xl shadow-lg w-full max-w-3xl flex flex-col h-[70vh]">
        <h2 className="text-2xl font-bold mb-4">Wiadomości</h2>
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.map((m) => (
            <div key={m.id} className="bg-white/10 p-2 rounded">
              <span className="font-semibold mr-2">{m.from}:</span>
              {m.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            className="flex-1 p-2 rounded text-black"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Napisz wiadomość..."
          />
          <button type="submit" className="bg-primary px-4 rounded">
            Wyślij
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
