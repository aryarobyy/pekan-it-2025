import React, { useEffect, useRef, useState } from "react";
import chatBg from "../../assets/images/chatBg.png";
import { MyFormInput } from "../../components/Form";
import { MyButton } from "../../components/Button";
import {
  useDeleteData,
  useFetchData,
  usePutData,
} from "../../hooks/useFetchData";
import { GROUP_CHAT_EP } from "../../core/endpoints";
import { ChatListSkeleton } from "../../components/skeletons/ChatListSkeleton";
import type {
  ResponseApiErrorType,
  ResponseApiType,
} from "../../types/apiType";
import { Undo2, UserRoundPlus, Users, UsersRound, X } from "lucide-react";
import socket from "../../socket/socket";
import { cn } from "../../utils/cn";
import MessageBubble from "../../components/chats/MessageBubble";
import type {
  GroupchatMemberType,
  GroupchatMessageType,
  GroupchatType,
  JoinedUserGroupChatType,
  PostGroupchatMessageType,
  UpdateGroupchatType,
} from "../../types/groupchat";
import GroupChatListItem from "../../components/chats/group/GroupChatListItem";
import useGetUser from "@/hooks/useGetUser";
import ChatPageSkeleton from "../../components/skeletons/ChatPageSkeleton";
import UnauthorizedPage from "@/components/systems/UnauthorizedPage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useToast from "@/hooks/useHotToast";
import { createFormData } from "@/helpers/formDataHelper";
import { formatCreationDate } from "@/utils/string";
import AddGroupMemberDialog from "../../components/chats/group/AddGroupMemberDialog";
import GroupChatMemberList from "../../components/chats/group/GroupChatMemberList";
import SideBarAddGroup from "@/components/chats/group/SideBarAddGroup";

const GroupChatPage = () => {
  const [selectedGroupChat, setSelectedGroupChat] =
    useState<GroupchatType | null>(null);
  const [activeGroup, setActiveGroup] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<GroupchatMessageType[] | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadings, setLoadings] = useState<{
    loadingLoadMessage: boolean;
    loadingSendMessage: boolean;
  }>({
    loadingLoadMessage: false,
    loadingSendMessage: false,
  });
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState<boolean>(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] =
    useState<boolean>(false);
  const [isAddGroupSideOpen, setIsAddGroupSideOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputMessageRef = useRef<HTMLInputElement>(null);
  const { user, loading: loadingGetUser } = useGetUser();

  // ## Hooks ##
  const [
    { apiData: groupChats, loading: loadingGroupChats },
    { reCallAPI: reFetchGroupChats, updateInitialUrl },
  ] = useFetchData<ResponseApiType<JoinedUserGroupChatType[]>>({
    url: `${GROUP_CHAT_EP}/user/${user?.id}`,
    initialCall: false,
  });
  const { putData: updateGroup } = usePutData<ResponseApiType<GroupchatType>>(
    GROUP_CHAT_EP,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const { deleteData: deleteGroup } = useDeleteData<
    ResponseApiType<GroupchatType>
  >(`${GROUP_CHAT_EP}`);

  const { deleteData: deleteMemberFromGroupchat } = useDeleteData<
    ResponseApiType<GroupchatMemberType>
  >(`${GROUP_CHAT_EP}/member`);

  const { pushToast, updateToast } = useToast();

  useEffect(() => {
    socket.connect();

    // Ambil Chat user
    const handleConnect = () => {
      console.log("Terhubung ke server Socket.IO!");
    };
    // Listener global untuk menerima pesan baru
    const handleReceiveMessage = (newMessage: GroupchatMessageType) => {
      if (newMessage) {
        setMessages((prev) => [...(prev ?? []), newMessage]);
      }
    };
    const handleSendChatMessageError = (error: ResponseApiErrorType) => {
      console.error(error);
      pushToast({
        message: "Gagal mengirim pesan",
        isError: true,
      });
    };

    socket.on("receive new group chat message", handleReceiveMessage);
    socket.on("send group chat message error", handleSendChatMessageError);
    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receive new group chat message", handleReceiveMessage);
      socket.off("send group chat message error", handleSendChatMessageError);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeGroup) {
      if (socket.connected) {
        setLoadings((prev) => ({ ...prev, loadingLoadMessage: true }));

        // Ambil semua message dari group chat
        const handleGroupChatMessage = (
          receivedMessages: ResponseApiType<GroupchatMessageType[]>
        ) => {
          setMessages(receivedMessages?.data || null);
          setLoadings((prev) => ({ ...prev, loadingLoadMessage: false }));
        };
        // Error nya
        const handleGetGroupChatMessage = (error: ResponseApiErrorType) => {
          console.error(error);
          pushToast({
            message: "Gagal mendapatkan pesan grup",
            isError: true,
          });
        };

        socket.emit("group chat", activeGroup.toString());
        socket.on("get detail group chat message", handleGroupChatMessage);
        socket.on(
          "get detail group chat message error",
          handleGetGroupChatMessage
        );

        return () => {
          socket.off("get detail group chat message", handleGroupChatMessage);
          socket.off(
            "get detail group chat message error",
            handleGetGroupChatMessage
          );
        };
      }
    } else {
      if (user) {
        reFetchGroupChats();
      }
      setMessages(null);
      setLoadings((prev) => ({ ...prev, loadingLoadMessage: false }));
    }
  }, [activeGroup]);

  useEffect(() => {
    if (user) {
      updateInitialUrl(`${GROUP_CHAT_EP}/user/${user.id}`, true, {});
    }
  }, [user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current!.scrollTop =
          messagesEndRef.current!.scrollHeight;
      }, 0);
    }

    if (inputMessageRef.current) {
      inputMessageRef.current.focus();
    }

    const handleEscPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsGroupInfoOpen(() => false);
        setActiveGroup(0);
        setSelectedGroupChat(null);
      }
    };

    document.addEventListener("keydown", handleEscPress);

    return () => {
      document.removeEventListener("keydown", handleEscPress);
    };
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    setLoadings((prev) => ({ ...prev, loadingSendMessage: true }));

    if (user) {
      const message: PostGroupchatMessageType = {
        groupId: activeGroup,
        authorId: user?.id,
        content: newMessage,
        image: "",
      };
      socket.emit("send group chat message", message);
      setNewMessage("");
    }
  };

  const handleSelectedGroup = (groupId: number, userChat: GroupchatType) => {
    setActiveGroup(groupId);
    setSelectedGroupChat(userChat);
  };

  const handleBackToListChat = () => {
    setIsAddGroupSideOpen(false);
    setIsGroupInfoOpen(() => false);
    setActiveGroup(0);
    setSelectedGroupChat(null);
  };

  const handleDeleteGroup = async (group: GroupchatType) => {
    if (user) {
      if (user.id !== group.authorId) {
        setIsShowAlert(true);
        return;
      }
      const toastId = pushToast({
        message: "Menghapus...",
        isLoading: true,
      });
      try {
        const response = await deleteGroup(group.id);
        if (response.code === 200) {
          reFetchGroupChats();
        }
        updateToast({
          toastId,
          message: "Berhasil terhapus!",
        });
      } catch (error) {
        console.error(error);
        updateToast({
          toastId,
          message: "Gagal Menghapus",
          isError: true,
        });
      }
    }
  };

  const handleUpdateGroup = async (
    groupId: number,
    data: UpdateGroupchatType
  ) => {
    const toastId = pushToast({
      message: "Memperbarui...",
      isLoading: true,
    });
    try {
      const formData = createFormData(data);
      const response = await updateGroup(
        formData,
        `${GROUP_CHAT_EP}/${groupId}`
      );

      if (response.code === 200) {
        reFetchGroupChats();
      }

      updateToast({
        toastId,
        message: "Berhasil Memperbarui!",
      });
    } catch (error) {
      console.error(error);
      updateToast({
        toastId,
        message: "Gagal Memperbarui",
        isError: true,
      });
    }
  };

  const handleRemoveUserFromGroup = async (member: GroupchatMemberType) => {
    const toastId = pushToast({
      message: "Mengeluarkan...",
      isLoading: true,
    });
    try {
      console.log(member);
      const result = await deleteMemberFromGroupchat(member.id);
      if (result.code === 200) {
        let filteredMember = selectedGroupChat?.members
          ? [...selectedGroupChat.members]
          : [];
        filteredMember = filteredMember.filter(
          (member2) => member2.id !== member.id
        );
        console.log(filteredMember);

        setSelectedGroupChat((prev) => {
          if (prev && prev.members) {
            return { ...prev, members: [...filteredMember] };
          } else {
            return null;
          }
        });
        updateToast({
          toastId,
          message: "Berhasil",
        });
      }
    } catch (error) {
      console.error(error);
      updateToast({
        toastId,
        message: "Gagal",
        isError: true,
      });
    }
  };

  return loadingGetUser ? (
    <ChatPageSkeleton />
  ) : !user ? (
    <UnauthorizedPage />
  ) : (
    <main className="pt-16 pb-16">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-[#2D3748] rounded-2xl shadow-2xl flex md:h-[40rem] md:max-h-[40rem]">
          {/* Add Group Sidebar */}
          <SideBarAddGroup
            user={user}
            isOpen={isAddGroupSideOpen}
            selectedGroupchat={selectedGroupChat}
            setIsOpen={setIsAddGroupSideOpen}
            reFetchGroupChats={reFetchGroupChats}
          />

          {/* Sidebar */}
          <aside
            className={cn(
              "bg-[#16243B] rounded-l-2xl transition-discrete overflow-hidden duration-[400ms]",
              selectedGroupChat ? "w-0 opacity-0" : "w-1/3 min-w-[300px] p-4",
              isAddGroupSideOpen && "w-0 opacity-0 min-w-0 p-0"
            )}
          >
            <div className="w-full flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white mb-4">Pesan Grup</h1>
              <button
                onClick={() => setIsAddGroupSideOpen(true)}
                className="flex flex-col  items-center text-slate-50 rounded-full p-2 px-3 cursor-pointer hover:bg-[#333d50]"
              >
                <Users />
                <p className="text-sm">Buat</p>
              </button>
            </div>
            <div className="relative mb-4">
              <MyFormInput
                name="search"
                type="text"
                placeholder="Search Group"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="!text-white !border-gray-600 focus:!border-blue-500"
                label=""
              />
            </div>
            <div className="flex-grow overflow-y-auto">
              {loadingGroupChats ? (
                Array(5)
                  .fill(null)
                  .map((_, idx) => <ChatListSkeleton key={idx} />)
              ) : !groupChats.data || groupChats.data?.length === 0 ? (
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-white">
                    Ayo coba buat grup dengan teman mu!
                  </p>
                  <MyButton
                    onClick={() => setIsAddGroupSideOpen(true)}
                    text={"Buat"}
                    variant="accent"
                    className="cursor-pointer"
                  />
                </div>
              ) : (
                groupChats.data?.map((group, idx) => {
                  return (
                    <GroupChatListItem
                      handleUpdate={handleUpdateGroup}
                      key={idx}
                      group={group.group}
                      isActive={activeGroup === group.group.id}
                      onClick={() =>
                        handleSelectedGroup(group.group.id, group.group)
                      }
                      handleDelete={handleDeleteGroup}
                    />
                  );
                })
              )}
            </div>
          </aside>

          {/* Room Chat */}
          {selectedGroupChat ? (
            <section className="w-full flex rounded-2xl transition-all duration-200 overflow-hidden relative">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50"
                style={{
                  backgroundImage: `url(${chatBg})`,
                  backgroundColor: "#fff",
                }}
              />

              <div className="relative z-10 flex flex-col h-full w-full">
                {/* Chat Header */}
                <header
                  className={cn(
                    "flex items-center px-4 border-b border-gray-700 bg-[#16243B]/80 backdrop-blur-sm gap-4 cursor-pointer",
                    !isGroupInfoOpen && "rounded-tr-2xl"
                  )}
                >
                  <button
                    className="text-slate-100 p-2 cursor-pointer rounded-full hover:bg-[#16243B]/40 transition-all ease-in-out duration-300"
                    type="button"
                    onClick={handleBackToListChat}
                  >
                    <Undo2 className="w-7 h-7" />
                  </button>
                  <div
                    className="w-full flex p-4 items-center"
                    onClick={() => setIsGroupInfoOpen(!isGroupInfoOpen)}
                  >
                    {selectedGroupChat.image ? (
                      <img
                        src={selectedGroupChat.image}
                        alt={"Avatar pic"}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                    ) : (
                      <UsersRound className="w-10 h-10 rounded-full bg-gray-400 p-1 mr-4" />
                    )}
                    <h2 className="text-lg font-semibold text-slate-50">
                      {selectedGroupChat.name}
                    </h2>
                  </div>
                </header>

                {/* Chat box */}
                <div
                  className="flex-grow p-6 overflow-y-auto space-y-4"
                  ref={messagesEndRef}
                >
                  {messages?.map((msg) => (
                    <MessageBubble
                      type="group"
                      message={msg}
                      key={msg.id}
                      isSender={msg.authorId === user.id}
                    />
                  ))}
                </div>
                {/* Input */}
                <div
                  className={cn(
                    "p-4 bg-[#16243B]/80 backdrop-blur-sm",
                    !isGroupInfoOpen && "rounded-br-2xl"
                  )}
                >
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center space-x-3"
                  >
                    <MyButton
                      text="😀"
                      variant="outline"
                      size="small"
                      className="!rounded-full !p-2"
                    />
                    <MyButton
                      text="📎"
                      variant="outline"
                      size="small"
                      className="!rounded-full !p-2"
                    />
                    <input
                      ref={inputMessageRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-grow bg-[#698EA4] border border-transparent focus:border-blue-500 rounded-lg px-4 py-2 text-white placeholder-white-400 focus:outline-none focus:ring-0 transition"
                    />
                    <MyButton
                      text="Send"
                      type="submit"
                      variant="secondary"
                      className="cursor-pointer"
                    />
                  </form>
                </div>
              </div>

              {/* Side page desc group */}
              <div
                className={`z-10 ${
                  isGroupInfoOpen ? "w-2/3" : "w-0"
                } transition-discrete duration-200 border-l-gray-500 border-l-2 bg-[#16243B]/80 backdrop-blur-sm overflow-hidden`}
              >
                <section className="flex gap-2 items-center p-4 border-b border-gray-700 bg-[#16243B]/80 backdrop-blur-sm text-slate-50">
                  <button
                    className=" p-2 cursor-pointer rounded-full hover:bg-[#16243B]/40 transition-all ease-in-out duration-300"
                    type="button"
                    onClick={() => setIsGroupInfoOpen(false)}
                  >
                    <X className="w-7 h-7" />
                  </button>
                  <h3 className="text-base">Informasi Grup</h3>
                </section>

                <section className="flex flex-col gap-4 justify-center items-center p-4 text-slate-50">
                  {selectedGroupChat.image ? (
                    <img
                      src={selectedGroupChat.image}
                      alt={"Avatar pic"}
                      className="w-25 h-25 rounded-full mr-4"
                    />
                  ) : (
                    <UsersRound className="w-25 h-25 rounded-full bg-gray-400 p-1" />
                  )}
                  <h2 className="text-lg font-semibold text-white">
                    {selectedGroupChat.name}
                  </h2>
                  <div>
                    <p>
                      Dibuat pada{" "}
                      {formatCreationDate(
                        selectedGroupChat.createdAt as unknown as string
                      )}
                    </p>
                  </div>
                </section>
                <section className="text-slate-50 bg-[#16243B]/80 backdrop-blur-sm h-full">
                  <div
                    className="flex gap-2 items-center cursor-pointer p-4 hover:bg-[#333d50]"
                    onClick={() => setIsAddMemberDialogOpen(true)}
                  >
                    <div className="bg-secondary p-2 rounded-full flex items-center justify-center text-gray-900">
                      <UserRoundPlus />
                    </div>
                    <p className="">Tambahkan teman</p>
                  </div>
                  <p className="px-4">{`${selectedGroupChat.members?.length} anggota grup`}</p>
                  <div className="p-4 flex flex-col gap-2">
                    {selectedGroupChat.members?.map((member) => (
                      <GroupChatMemberList
                        key={member.id}
                        handleDelete={handleRemoveUserFromGroup}
                        isUserItSelf={user.id === member.userId}
                        member={member}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </section>
          ) : (
            <section className="w-2/3 flex flex-col rounded-r-2xl overflow-hidden relative bg-black items-center justify-center">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50 z-0"
                style={{
                  backgroundImage: `url(${chatBg})`,
                  backgroundColor: "#fff",
                }}
              />
              <div className="z-10">
                <h1 className="text-2xl text-slate-50">
                  Tolong buatin UI buat nyuruh user start chatting or whatever
                </h1>
              </div>
            </section>
          )}
        </div>
      </div>

      <AddGroupMemberDialog
        userId={user.id}
        selectedGroup={selectedGroupChat}
        setSelectedGroup={setSelectedGroupChat}
        handleOpen={() => setIsAddMemberDialogOpen(false)}
        isOpen={isAddMemberDialogOpen}
      />

      <AlertDialog
        open={isShowAlert}
        onOpenChange={() => setIsShowAlert(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ops! Tidak dapat menghapus grup ini
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Kamu tidak dapat menghapus grup ini. Hanya pembuat grup yang dapat
              menghapus grup.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="cursor-pointer">
              Baik
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default GroupChatPage;
