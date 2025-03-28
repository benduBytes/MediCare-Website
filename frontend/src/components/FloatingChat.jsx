import { useState, useRef, useEffect } from "react";
import axios from "axios";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Fab } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

const API_KEY = "AIzaSyCWu5KQ9ff9L_F_s2j67-D_7QXJJLSr034";

function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  const toggleChat = () => setIsOpen(!isOpen);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");

    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: currentQuestion }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const aiResponse =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry - No response received.";

      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: aiResponse },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "answer",
          content: "Sorry - Something went wrong. Please try again!",
        },
      ]);
    }

    setGeneratingAnswer(false);
  }

  return (
    <div>
      {/* Floating Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={toggleChat}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 999,
          backgroundColor: "#007bff",
          "&:hover": { backgroundColor: "#0056b3" },
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {/* Chat Box */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 w-[350px] max-h-[500px] bg-white border border-gray-300 shadow-lg rounded-xl overflow-hidden z-[9999]"
        >
          {/* Chat Header */}
          <div className="bg-blue-500 text-white flex justify-between items-center p-3">
            <span className="font-bold">Chat AI</span>
            <button onClick={toggleChat} className="hover:text-gray-200">
              ✖️
            </button>
          </div>

          {/* Chat History */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-3 hide-scrollbar"
            style={{ maxHeight: "400px" }}
          >
            {chatHistory.length === 0 ? (
              <p className="text-gray-500 text-center">Start a conversation...</p>
            ) : (
              chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`mb-3 ${
                    chat.type === "question" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      chat.type === "question"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    <ReactMarkdown>{chat.content}</ReactMarkdown>
                  </div>
                </div>
              ))
            )}

            {generatingAnswer && (
              <div className="text-left">
                <div className="inline-block bg-gray-100 p-2 rounded-lg animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={generateAnswer} className="p-3 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask something..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-500 text-white rounded-r-lg ${
                  generatingAnswer
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
                disabled={generatingAnswer}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default FloatingChat;
