import React from "react";
import type { PrivateChatMessageType } from "../../types/privatechat";
import { formatMessageDeliveryTime } from "../../utils/string";
import type { GroupchatMessageType } from "../../types/groupchat";
import { Link } from "react-router";
import { cn } from "../../utils/cn";

type PropsType  = {
  type: "group",
  message: GroupchatMessageType;
  isSender: boolean;
} | {
  type: "private",
  message: PrivateChatMessageType;
  isSender: boolean;
}

const MessageBubble = React.memo(({
  type,
  message,
  isSender,
}: PropsType) => (
  <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-xs lg:max-w-md p-3 py-2 rounded-2xl ${
        isSender
          ? "bg-[#4A90E2] text-white rounded-br-none"
          : "bg-[#385484] text-white rounded-bl-none"
      }`}
    >
      {type === "group" && (
        <Link className={cn(isSender ? "text-[#16243B]" : "text-secondary")} to={`#${message.authorId}`}>
          {message.author?.username}
        </Link>
      )}
      <p className="break-words">{message.content}</p>
      <span className="text-[11px]">
        {formatMessageDeliveryTime(String(message.createdAt))}
      </span>
    </div>
  </div>
));

export default MessageBubble;