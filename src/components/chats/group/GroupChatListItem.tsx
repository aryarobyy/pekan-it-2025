import {
  EllipsisVertical,
  PencilLineIcon,
  Trash,
  UsersRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@radix-ui/react-dropdown-menu";
import type { GroupchatType, UpdateGroupchatType } from "@/types/groupchat";
import { truncateString } from "@/utils/string";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import DeleteAlertDialog from "../DeleteAlertDialog";

type PropsType = {
  isActive: boolean;
  onClick: () => void;
  group: GroupchatType;
  handleDelete: (group: GroupchatType) => void;
  handleUpdate: (groupId: number, data: UpdateGroupchatType) => void;
};

const GroupChatListItem = React.memo(
  ({ group, isActive, onClick, handleDelete, handleUpdate }: PropsType) => {
    const handleChatClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      onClick()
    }
    return (
      <div
        onClick={(e) => handleChatClick(e)}
        className={`group flex items-center p-3 cursor-pointer rounded-lg transition-colors duration-200 gap-1 ${
          isActive ? "bg-[#4A5568]" : "hover:bg-[#2D3748]"
        }`}
      >
        {group.image ? (
          <img
            src={group.image}
            alt={group.name}
            className="w-12 h-12 rounded-full mr-4"
          />
        ) : (
          <div className="w-12 h-12 rounded-full mr-4 bg-gray-300 border flex items-center justify-center p-3">
            <UsersRound />
          </div>
        )}
        <div className="flex overflow-x-hidden justify-between items-center w-full">
          <div className="flex-grow">
            <h3 className="font-semibold text-white">{group.name}</h3>
            {group.messages && group.messages.length !== 0 ? (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-400 truncate">
                  {truncateString(
                    group.messages[0].author?.name
                      ? `${group.messages[0].author?.name}: `
                      : "~"
                  )}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {truncateString(group.messages[0].content)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 truncate">
                "Start chatting!"
              </p>
            )}
          </div>
          <DropDownSettingGroup
            group={group}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
          />
        </div>
      </div>
    );
  }
);

type DropDownPropsType = {
  handleDelete: (group: GroupchatType) => void;
  handleUpdate: (groupId: number, data: UpdateGroupchatType) => void;
  group: GroupchatType;
};

const DropDownSettingGroup = React.memo(
  ({ handleUpdate, handleDelete, group }: DropDownPropsType) => {
    const [tempImg, setTempImg] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newData, setNewData] = useState<UpdateGroupchatType>({
      authorId: group.authorId,
      name: group.name,
      image: group.image,
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        const tempFile = URL.createObjectURL(file);
        setTempImg(tempFile);
        setNewData((prev) => ({ ...prev, newImage: file }));
      }
    };

    const handleImageClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
          <EllipsisVertical className="hidden group-hover:block text-slate-50 transition-all" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={(e) => e.stopPropagation()}
          align="center"
          className=""
        >
          <DropdownMenuLabel className="border-b p-1 my-2 text-center">
            Group setting
          </DropdownMenuLabel>
          <DropdownMenuGroup className="flex flex-col">
            {/* Update */}
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <div className="flex cursor-pointer hover:bg-primary p-2 hover:text-secondary w-full justify-between items-center rounded-sm">
                    Perbarui
                    <PencilLineIcon />
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Perbarui Grup</DialogTitle>
                    <DialogDescription>
                      Perbarui informasi grup disini, jika sudah tekan tombol
                      simpan.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-full flex items-center justify-center">
                    {group.image || tempImg ? (
                      <div className="relative group cursor-pointer">
                        <div
                          onClick={handleImageClick}
                          className="absolute group-hover:opacity-100 opacity-0 transition-opacity duration-200 w-full h-full z-10 bg-black/45 rounded-full text-center flex items-center"
                        >
                          <input
                            onChange={handleFileChange}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                          />
                          <p className="text-xs text-slate-50">
                            Ubah ikon grup
                          </p>
                        </div>

                        <img
                          src={tempImg ? tempImg : group.image + ""}
                          alt={group.name}
                          className="w-[5rem] h-[5rem] rounded-full "
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center relative group cursor-pointer">
                        <div
                          onClick={handleImageClick}
                          className="absolute group-hover:opacity-100 opacity-0 transition-opacity duration-200 w-full h-full z-10 bg-black/45 rounded-full text-center flex items-center"
                        >
                          <input
                            onChange={handleFileChange}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                          />
                          <p className="text-xs text-slate-50">
                            Unggah ikon grup
                          </p>
                        </div>
                        {tempImg ? (
                          <img
                            src={tempImg}
                            alt={group.name}
                            className="w-[5rem] h-[5rem] rounded-full "
                          />
                        ) : (
                          <UsersRound className="w-[5rem] h-[5rem] rounded-full border p-1" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Nama Grup</Label>
                    <Input
                      id="name-1"
                      name="name"
                      defaultValue={group.name}
                      value={newData.name}
                      onChange={(e) =>
                        setNewData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button className="cursor-pointer" variant="outline">
                        Batalkan
                      </Button>
                    </DialogClose>
                    <Button
                      className="cursor-pointer"
                      onClick={() => handleUpdate(group.id, newData)}
                      type="submit"
                    >
                      Simpan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>

            {/* Delete */}
            <DeleteAlertDialog
              title="Kamu yakin ingin menghapus grup ini?"
              description="Tindakan ini akan menghapus data grup secara permanen dan menghapus."
              handleActionButton={() => handleDelete(group)}
            >
              <div className="flex cursor-pointer hover:bg-primary p-2 hover:text-secondary w-full justify-between items-center rounded-sm group">
                Hapus
                <Trash className="group-hover:text-red-500" />
              </div>
            </DeleteAlertDialog>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
export default GroupChatListItem;
