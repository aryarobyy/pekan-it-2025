import { MyButton } from "@/components/Button";
import { MyFormInput } from "@/components/Form";
import { GROUP_CHAT_EP } from "@/core/endpoints";
import { createFormData } from "@/helpers/formDataHelper";
import { usePostData } from "@/hooks/useFetchData";
import useToast from "@/hooks/useHotToast";
import type { ResponseApiType } from "@/types/apiType";
import type { GroupchatType, PostGroupchatType } from "@/types/groupchat";
import type { UserType } from "@/types/user";
import { cn } from "@/utils/cn";
import { MoveLeft, UsersRound } from "lucide-react";
import { useRef, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";

type PropsType = {
  user: UserType
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedGroupchat: GroupchatType | null;
  reFetchGroupChats: () => void;
};

export default function SideBarAddGroup({
  user,
  isOpen,
  setIsOpen,
  selectedGroupchat,
  reFetchGroupChats,
}: PropsType) {
  const [tempImage, setTempImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newData, setNewData] = useState<PostGroupchatType>({
    authorId: user.id,
    image: null,
    name: ""
  });

  const {postData: postGroup} = usePostData<ResponseApiType<GroupchatType>>(GROUP_CHAT_EP, {
    headers: {
      "Content-Type": "multi"
    }
  })
  const { pushToast, updateToast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setNewData((prev) => ({ ...prev, image: file }));
      const tempFile = URL.createObjectURL(file);
      setTempImage(tempFile);
      // setNewData((prev) => ({ ...prev, newImage: file }));
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClose = () => {
    // setTempImage("");
    setIsOpen(false);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>
) => {
    e.preventDefault();
    if(!newData.name) {
      return;
    };
    
    const toastId = pushToast({
      message: "Membuat grup...",
      isLoading: true
    });

    try {
      const formData = createFormData(newData)
      const result = await postGroup(formData);
      console.log(result);
      
      if(result.code === 200) {
        updateToast({
          toastId,
          message: "Berhasil",
        })
        reFetchGroupChats();
        handleClose();
        return;
      };
      updateToast({
        toastId,
        message: "Gagal",
        isError: true
      })
      console.error("Uncatched Error");
    } catch (error) {
      console.error(error);
      updateToast({
        toastId,
        message: "Gagal",
        isError: true
      })
    }
  }

  return (
    <aside
      className={cn(
        "bg-[#16243B] rounded-l-2xl transition-discrete overflow-hidden duration-[400ms]",
        isOpen ? "w-1/3 min-w-[300px] p-4" : "w-0 opacity-0",
        selectedGroupchat
      )}
    >
      <div className="w-full flex items-center">
        <button
          onClick={handleClose}
          className="flex flex-col  items-center text-slate-50 rounded-full p-2 px-3 cursor-pointer hover:bg-[#333d50]"
        >
          <MoveLeft className="w-8 h-8" />
        </button>
        <h1 className="text-xl text-slate-50">Buat Grup</h1>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto p-4">
        <div className="flex items-center justify-center relative group cursor-pointer text-slate-50">
          <div
            onClick={handleImageClick}
            className={cn(
              "absolute transition-opacity duration-200 w-fit h-full z-10 rounded-full text-center flex items-center justify-center p-2 group bg-black/60",
              tempImage ? "opacity-0 hover:opacity-100" : ""
            )}
          >
            <input
              onChange={handleFileChange}
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
            />
            {
              <p
                className={cn(
                  "text-xs w-2/3 text-slate-50",
                  tempImage ? "opacity-0 group-hover:opacity-100" : ""
                )}
              >
                Unggah ikon grup
              </p>
            }
          </div>
          <div className="w-fit">
            {tempImage ? (
              <img
                src={tempImage}
                alt="group image"
                className="w-[7rem] h-[7rem] rounded-full"
              />
            ) : (
              <UsersRound className="w-[7rem] h-[7rem] p-4 px-6" />
            )}
          </div>
        </div>
          <form onSubmit={handleSubmit}>
            <MyFormInput
              className="text-slate-50"
              label="Nama Grup"
              name="group-name"
              type="text"
              placeholder="Nama Grup"
              value={newData?.name}
              onChange={(e) =>
                setNewData((prev) => ({ ...prev, name: e.target.value }))
              }
            />

            <div className="w-full flex items-center justify-center">
              <MyButton text="Buat" type="submit" variant="accent" className="cursor-pointer" />
            </div>
          </form>
      </div>
    </aside>
  );
}
