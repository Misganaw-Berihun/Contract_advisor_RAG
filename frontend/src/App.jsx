import React, { useState } from "react";
import "./App.css"; // Don't forget to import or include your CSS file
import Navbar from "./components/nav-bar";

const ChatMessage = ({ message, isUserQuestion }) => (
  <div
    className={`message-container ${
      isUserQuestion ? "user-question" : "chatbot-answer"
    }`}
  >
    <div
      className={`message ${
        isUserQuestion ? "text-left user-text" : "text-right chatbot-text"
      }`}
    >
      <p className="message-text">{message}</p>
      <small className="text-body-secondary">Just now</small>
    </div>
  </div>
);

function App() {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      message: "Hello! This is a chatbot.",
      isUserQuestion: false,
    },
  ]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newUserQuestion = {
        message: newMessage,
        isUserQuestion: true,
      };

      const chatbotResponse = {
        message: `Chatbot: ${newMessage} sounds interesting!`,
        isUserQuestion: false,
      };

      setMessages([...messages, newUserQuestion, chatbotResponse]);
      setNewMessage("");
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="container mt-5"
        style={{
          paddingBottom: "60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="chat-panel" style={{ width: "70%" }}>
          {messages.map((msg, index) => (
            <ChatMessage key={index} {...msg} />
          ))}
        </div>
        <div
          className="panel-footer chat-footer"
          style={{
            position: "fixed",
            bottom: 0,
            width: "70%",
            background: "#f5f5f5",
            padding: "15px",
          }}
        >
          <div className="input-group">
            <input
              id="btn-input"
              type="text"
              className="form-control input-sm chat-input"
              placeholder="Type your question here..."
              value={newMessage}
              onChange={handleInputChange}
            />
            <span className="input-group-btn">
              <button
                className="btn btn-warning btn-sm chat-btn"
                id="btn-chat"
                onClick={handleSendMessage}
              >
                Ask
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
