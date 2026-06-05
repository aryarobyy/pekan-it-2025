import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ban, EllipsisVertical, Trash } from "lucide-react";
import DeleteAlertDialog from "../DeleteAlertDialog";
import type { PrivateChatType } from "@/types/privatechat";
import type { UserType } from "@/types/user";

type PropsType = {
    handleDelete: (chat: PrivateChatType) => void;
    handleBlockUser: (user: UserType) => void;
    chat: PrivateChatType
};

export default function DropDownChatListItem({chat, handleDelete, handleBlockUser}: PropsType) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        <EllipsisVertical className="hidden group-hover:block text-slate-50 transition-all" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuGroup className="flex flex-col">
          {/* Delete */}
          <DeleteAlertDialog
            title="Kamu yakin ingin percakapan ini?"
            description="Tindakan ini akan menghapus data percakapan secara permanen."
            handleActionButton={() => handleDelete(chat)}
          >
            <div className="flex cursor-pointer hover:bg-primary p-2 hover:text-secondary w-full justify-between items-center rounded-sm gap-2 group">
              Hapus Percakapan
              <Trash className="group-hover:text-red-500" />
            </div>
          </DeleteAlertDialog>
          <DeleteAlertDialog
            title="Apakah Anda yakin ingin memblokir pengguna ini?"
            description="Tindakan ini akan menyebabkan anda tidak dapat berbincang dengan teman anda, maupun sebaliknya."
            handleActionButton={() => {}}
          >
            <div className="flex cursor-pointer hover:bg-primary p-2 hover:text-secondary w-full justify-between items-center rounded-sm gap-2 group">
              Blokir
              <Ban className="group-hover:text-red-500" />
            </div>
          </DeleteAlertDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
