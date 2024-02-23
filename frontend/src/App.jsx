import { useState } from "react";
import Dropzone from "react-dropzone";
import "./App.css";
import Navbar from "./components/nav-bar";
import axios from "axios";
import { memo } from "react";

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

const Sidebar = ({ onFileUpload, uploadedFiles, onRemoveFile }) => (
  <div className="sidebar">
    <h2>File Upload</h2>
    <Dropzone onDrop={(acceptedFiles) => onFileUpload(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      )}
    </Dropzone>
    <div className="uploaded-files">
      <h3>Uploaded Files:</h3>
      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={index}>
            {file.name}
            <span className="remove-file" onClick={() => onRemoveFile(index)}>
              Remove
            </span>
          </li>
        ))}
      </ul>
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
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const newUserQuestion = {
        message: newMessage,
        isUserQuestion: true,
      };

      const formData = new FormData();
      formData.append("user_question", newMessage);

      uploadedFiles.forEach((file) => {
        formData.append(`files`, file);
      });

      const chatbotResponse = {
        message: ``,
        isUserQuestion: false,
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/api/chat",
          formData
        );

        chatbotResponse.messasge = response.data.response;
      } catch (error) {
        console.error("Error sending message:", error);
      }

      setMessages([...messages, newUserQuestion, chatbotResponse]);
      setNewMessage("");
      setUploadedFiles([]);
    }
  };

  // const handleSendMessage = async () => {

  //     const config = {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     };

  //     const formData = new FormData();

  //     const readFileAndAppend = (file, index) => {
  //       const reader = new FileReader();

  //       reader.onload = (event) => {
  //         const fileContent = event.target.result;
  //         formData.append(
  //           `files`,
  //           new Blob([fileContent], { type: file.type }),
  //           file.name
  //         );

  //         if (index === uploadedFiles.length - 1) {
  //           console.log(formData);
  //         }
  //       };

  //       reader.readAsArrayBuffer(file);
  //     };

  //     uploadedFiles.forEach((file, index) => {
  //       readFileAndAppend(file, index);
  //     });

  //     console.log(formData.entries());
  //     const chatbotResponse = {
  //       message: ``,
  //       isUserQuestion: false,
  //     };

  //     try {
  //       const response = await axios.post("http://localhost:5000/api/chat", {
  //         user_question: newMessage,
  //         uploadedFiles: formData,
  //         config,
  //       });

  //       chatbotResponse.messasge = response.data.response;
  //     } catch (error) {
  //       console.error("Error sending message:", error);
  //     }

  //     setMessages([...messages, newUserQuestion, chatbotResponse]);
  //     setNewMessage("");
  //   }
  // };

  const handleFileUpload = (files) => {
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  return (
    <div>
      <Navbar />
      <div
        className="container"
        style={{ paddingBottom: "60px", display: "flex" }}
      >
        <div
          className="sidebar-container"
          style={{
            width: "30%",
            height: "100vh",
            background: "#f5f5f5",
            padding: "20px",
          }}
        >
          <Sidebar
            onFileUpload={handleFileUpload}
            uploadedFiles={uploadedFiles}
            onRemoveFile={handleRemoveFile}
          />
        </div>
        <div className="main-content" style={{ width: "70%", padding: "20px" }}>
          <div className="chat-panel">
            {messages.map((msg, index) => (
              <ChatMessage key={index} {...msg} />
            ))}
          </div>
          <div
            className="panel-footer chat-footer"
            style={{
              position: "fixed",
              bottom: 0,
              width: "65%",
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
    </div>
  );
}

export default App;
