// src/pages/ChatBubble.jsx
import React from "react";

const ChatBubble = ({ msg, self }) => {
  return (
    <div
      className={`max-w-[70%] px-4 py-2 rounded-xl shadow-md text-sm break-words ${
        self
          ? "ml-auto bg-purple-600 text-white rounded-br-none"
          : "mr-auto bg-gray-200 text-black dark:bg-gray-700 dark:text-white rounded-bl-none"
      }`}
    >
      {msg.message}
    </div>
  );
};

export default ChatBubble;
