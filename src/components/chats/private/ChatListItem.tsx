import { UserRound } from "lucide-react";
import { truncateString } from "../../../utils/string";
import type { PrivateChatType } from "@/types/privatechat";
import { useMemo } from "react";
import type { UserType } from "@/types/user";
import DropDownChatListItem from "./DropDownChatListItem";

type PropsType = {
  chat: PrivateChatType;
  user: UserType;
  isActive: boolean;
  onClick: () => void;
  handleDelete: (chat: PrivateChatType) => void;
  handleBlock: (user: UserType) => void;
};

const ChatListItem = ({
  chat,
  user,
  isActive,
  onClick,
  handleBlock,
  handleDelete
}: PropsType) => {
  const friend = useMemo(() => {
    return user.id === chat.userIdOne ? chat.userTwo: chat.userOne
  }, []);

  return (
    <div
      onClick={onClick}
      className={`group flex items-center p-3 cursor-pointer rounded-lg transition-colors duration-200 gap-1 ${
        isActive ? "bg-[#4A5568]" : "hover:bg-[#2D3748]"
      }`}
    >
      {friend.avatar ? (
        <img
          src={friend.avatar}
          alt={"Avatar"}
          className="w-12 h-12 rounded-full mr-4"
        />
      ) : (
        <div className="w-12 h-12 rounded-full mr-4 bg-gray-300 border flex items-center justify-center p-3">
          <UserRound />
        </div>
      )}
      <div className="flex overflow-x-hidden justify-between items-center w-full">
        <div className="flex-grow">
          <h3 className="font-semibold text-white">{friend.name}</h3>
          <p className="text-sm text-gray-400 truncate">
            {truncateString(
              chat.messages ? chat.messages[0]?.content : "Start chatting!",
              30
            )}
          </p>
        </div>
        <DropDownChatListItem chat={chat} handleDelete={handleDelete} handleBlockUser={handleBlock} />
      </div>
    </div>
  );
};

export default ChatListItem;
