import React from "react";
import ChatBox from "../components/ChatBox"; // Adjust the path to your ChatBox component

export default function ChatPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // Align the chat box to the left
        alignItems: "flex-start", // Vertically center the chat box
        height: "calc(100vh-400px)", // Full-screen height
        width: "100vw", // Full-screen width
        padding: "10px", // Add some padding around the chat box
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "800px", // Set a fixed width for the chat box
          height: "100%", // Make the chat box fill the height of the page
        }}
      >
        <ChatBox />
      </div>
    </div>
  );
}