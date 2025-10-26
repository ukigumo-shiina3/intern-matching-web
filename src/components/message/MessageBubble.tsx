import React from "react";
import { G_GetMessagesQuery } from "@/lib/graphql";

type Message = G_GetMessagesQuery["messages"][number];

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar?: boolean;
}

export default function MessageBubble({
  message,
  isOwnMessage,
  showAvatar = true,
}: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString("ja-JP", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("ja-JP", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div
      className={`flex gap-2 mb-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="flex flex-col items-center" style={{ width: "40px" }}>
        {showAvatar && !isOwnMessage && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {message.sender.name[0]}
          </div>
        )}
      </div>
      <div
        className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} max-w-[70%]`}
      >
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwnMessage
              ? "bg-[#00B900] text-white rounded-br-sm"
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-sm"
          }`}
        >
          <p className="whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        </div>
        <span className="text-xs text-gray-400 mt-1 px-1">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
