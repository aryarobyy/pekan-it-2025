import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GroupchatMemberType } from "@/types/groupchat";
import { EllipsisVertical, UserRoundX, UsersRound } from "lucide-react";

type PropsType = {
  handleDelete: (member: GroupchatMemberType) => void;
  member: GroupchatMemberType;
  isUserItSelf: boolean;
};
export default function GroupChatMemberList({
  member,
  handleDelete,
  isUserItSelf,
}: PropsType) {
  return (
    <div
      key={member.userId}
      className="flex justify-between items-center group hover:bg-[#333d50] rounded-md"
    >
      <div className="flex items-center gap-3 ">
        {member.user.avatar ? (
          <img
            src={member.user.avatar}
            alt={"Avatar pic"}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <UsersRound className="w-10 h-10 rounded-full bg-gray-400 p-1" />
        )}
        <p>{member.user.name}</p>
      </div>
      {!isUserItSelf && (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-700 transition-all">
            <EllipsisVertical className="group-hover:block text-slate-50 transition-all" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="shadow-md">
            <DropdownMenuItem
              onSelect={() => {handleDelete(member)}}
              className="p-0" 
            >
              <button
                className="flex items-center gap-2 p-2 w-full text-left cursor-pointer hover:bg-gray-300 text-red-500 rounded-md" // Pastikan button mengambil lebar penuh item
              >
                <UserRoundX className="mr-2 h-4 w-4" />{" "}
                {/* Icon yang lebih pas */}
                Keluarkan
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
