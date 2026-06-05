import React, {
  useEffect,
  useState,
  useRef,
  type ChangeEvent,
} from "react";
import chatBg from "../../assets/images/chatBg.png";
import { MyFormInput } from "../../components/Form";
import { MyButton } from "../../components/Button";
import { useDeleteData, useFetchData, usePostData } from "../../hooks/useFetchData";
import { PRIVATE_CHAT_EP, USER_EP } from "../../core/endpoints";
import { ChatListSkeleton } from "../../components/skeletons/ChatListSkeleton";
import { Undo2, UserRound } from "lucide-react";
import type {
  PostPrivateChatMessageType,
  PrivateChatMessageType,
  PrivateChatType,
} from "../../types/privatechat";
import type {
  ResponseApiErrorType,
  ResponseApiType,
} from "../../types/apiType";
import type { FriendReqType, UserType } from "../../types/user";
import socket from "../../socket/socket";
import { cn } from "../../utils/cn";
import MessageBubble from "../../components/chats/MessageBubble";
import ChatListItem from "../../components/chats/private/ChatListItem";
import useGetUser from "@/hooks/useGetUser";
import ChatPageSkeleton from "../../components/skeletons/ChatPageSkeleton";
import UnauthorizedPage from "@/components/systems/UnauthorizedPage";
import useToast from "@/hooks/useHotToast";

const PrivateChatPage = () => {
  const [selectedUserChat, setSelectedUserChat] = useState<UserType | null>(
    null
  );
  const [activeChatId, setactiveChatId] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<PrivateChatMessageType[] | null>(
    null
  );
  const [newMessage, setNewMessage] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadings, setLoadings] = useState<{
    loadingLoadMessage: boolean;
    loadingSendMessage: boolean;
  }>({
    loadingLoadMessage: false,
    loadingSendMessage: false,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputMessageRef = useRef<HTMLInputElement>(null);
  
  const { user, loading: loadingGetUser } = useGetUser();

  const [
    { apiData: privateChats, loading: loadingPrivateChats },
    { reCallAPI: reFetchPrivateChats, updateInitialUrl },
  ] = useFetchData<ResponseApiType<PrivateChatType[]>>({
    url: `${PRIVATE_CHAT_EP}/${user?.id}`,
    initialCall: false,
  });

  const {deleteData: deleteChat} = useDeleteData<ResponseApiType<PrivateChatType>>(PRIVATE_CHAT_EP)
  const {postData: blockUser} = usePostData<ResponseApiType<FriendReqType>>(`${USER_EP}/friends/status`)

  const {pushToast, updateToast} = useToast();

  useEffect(() => {
    socket.connect();

    // Ambil Chat user
    const handleConnect = () => {
      console.log("Terhubung ke server Socket.IO!");
    };
    // Listener global untuk menerima pesan baru
    const handleReceiveMessage = (newMessage: PrivateChatMessageType) => {
      if (newMessage) {
        setMessages((prev) => [...(prev ?? []), newMessage]);
      }
    };
    const handleSendPrivateChatMessageError = (error: ResponseApiErrorType) => {
      console.error(error);
      alert(error.message);
    };

    socket.on("receive new private chat message", handleReceiveMessage);
    socket.on(
      "send private chat message error",
      handleSendPrivateChatMessageError
    );
    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receive new private chat message", handleReceiveMessage);
      socket.off("send private chat message error", handleSendPrivateChatMessageError);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeChatId) {
      if (socket.connected) {
        setLoadings((prev) => ({ ...prev, loadingLoadMessage: true }));

        // Ambil semua message dari suatu private chat
        const handlePrivateChatMessage = (
          receivedMessages: PrivateChatType
        ) => {
          setMessages(receivedMessages?.messages || null);
          setLoadings((prev) => ({ ...prev, loadingLoadMessage: false }));
        };
        // Error nya
        const handleGetPrivateChatMessage = (error: ResponseApiErrorType) => {
          console.error(error);
          alert(error.message);
        };

        socket.emit("private chat", activeChatId.toString());
        socket.on("get detail private chat message", handlePrivateChatMessage);
        socket.on(
          "get detail private chat message error",
          handleGetPrivateChatMessage
        );

        return () => {
          socket.off(
            "get detail private chat message",
            handlePrivateChatMessage
          );
          socket.off(
            "get detail private chat message error",
            handleGetPrivateChatMessage
          );
        };
      }
    } else {
      reFetchPrivateChats();
      setMessages(null);
      setLoadings((prev) => ({ ...prev, loadingLoadMessage: false }));
    }
  }, [activeChatId]);

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

    if(user) {
      updateInitialUrl(`${PRIVATE_CHAT_EP}/${user.id}`, true, {});
    }

    const handleEscPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setactiveChatId(0);
        setSelectedUserChat(null);
      }
    };

    document.addEventListener("keydown", handleEscPress);

    return () => {
      document.removeEventListener("keydown", handleEscPress);
    };
  }, [messages, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    setLoadings((prev) => ({ ...prev, loadingSendMessage: true }));
    if(user) {
      const message: PostPrivateChatMessageType = {
        authorId: user.id,
        chatId: activeChatId,
        content: newMessage,
        image: null,
      };
      socket.emit("send private chat message", message);
      setNewMessage("");
    }
    console.warn("User not found!");
  };

  const handleSelectedChat = (chatId: number, userChat: UserType) => {
    setactiveChatId(chatId);
    setSelectedUserChat(userChat);
  };

  const handleBackToListChat = () => {
    setactiveChatId(0);
    setSelectedUserChat(null);
  };

  const handleDeleteChat = async (chat: PrivateChatType) => {
    const toastId = pushToast({
      message: "",
      isLoading: true
    })
    try {
     const result = await deleteChat(chat.id)
      if(result.code === 200) {
        updateToast({
          toastId,
          message: "Berhasil",
        })
        reFetchPrivateChats();
        return;
      }
      
      updateToast({
        toastId,
        message: "Gagal",
      })
      console.error("Uncatched Error!");
    } catch (error) {
      console.error(error);
      updateToast({
        toastId,
        message: "Gagal",
        isError: true
      })
    }
  };
  
  const handleBlockUser = (user: UserType) => {
    
    // ## Soon

    // const toastId = pushToast({
    //   message: "",
    //   isLoading: true
    // })
    // try {
    //   const result = await blockUser({
    //     requesterId: user,
    //     receiverId: 5,
    //     status: "BLOCKED"
    //   })
    //   updateToast({
    //     toastId,
    //     message: "Berhasil",
    //   })

    //   updateToast({
    //     toastId,
    //     message: "Gagal",
    //   })
    //   console.error("Uncatched Error!");
    // } catch (error) {
    //   console.error(error);
    //   updateToast({
    //     toastId,
    //     message: "Gagal",
    //     isError: true
    //   })
    // }
  }

  return loadingGetUser ? (
    <ChatPageSkeleton />
  ) : !user ? (
    <UnauthorizedPage />
  ) : (
    <main className="pt-16 pb-16">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-[#2D3748] rounded-2xl shadow-2xl flex md:h-[40rem] md:max-h-[40rem]">
          {/* Sidebar */}
          <aside
            className={cn(
              "w-full bg-[#16243B] rounded-l-2xl flex-col transition-discrete overflow-hidden duration-[400ms]",
              selectedUserChat ? "w-0 opacity-0 md:flex" : "md:w-1/3 md:min-w-[300px] p-4 flex" // Hide on mobile when chat is selected
            )}
          >
            <h1 className="text-2xl font-bold text-white mb-4">Chats</h1>
            <div className="relative mb-4">
              <MyFormInput
                name="search"
                type="text"
                placeholder="Search or new chat"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="!text-white !border-gray-600 focus:!border-blue-500"
                label=""
              />
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
              {loadingPrivateChats ? (
                Array(5)
                  .fill(null)
                  .map((_, idx) => <ChatListSkeleton key={idx} />)
              ) : !privateChats.data || privateChats.data?.length === 0 ? (
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-slate-50">
                    Ayo mulai percakapan dengan temanmu!
                  </p>
                  <a href="/friend">
                    <MyButton text={"Cari Teman"} variant="secondary" />
                  </a>
                </div>
              ) : (
                privateChats.data?.map((chat, idx) => {
                  const activedUser =
                    user.id === chat.userIdOne ? chat.userTwo : chat.userOne;
                  return (
                    <ChatListItem
                      key={idx}
                      chat={chat}
                      user={user}
                      isActive={activeChatId === chat.id}
                      onClick={() => handleSelectedChat(chat.id, activedUser)}
                      handleBlock={handleBlockUser}
                      handleDelete={handleDeleteChat}
                    />
                  );
                })
              )}
            </div>
          </aside>

          {/* Room Chat */}
          {selectedUserChat ? (
            <section className="w-full flex rounded-2xl transition-all duration-200 overflow-hidden relative">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50"
                style={{
                  backgroundImage: `url(${chatBg})`,
                  backgroundColor: "#fff",
                }}
              />

              {/* Chat Header */}
              <div className="relative z-10 flex flex-col h-full w-full">
                <header className="flex items-center p-4 border-b border-gray-700 bg-[#16243B]/80 backdrop-blur-sm rounded-tr-2xl gap-4">
                  <button
                    className="text-slate-100 p-2 cursor-pointer rounded-full hover:bg-[#16243B]/40 transition-all ease-in-out duration-300"
                    type="button"
                    onClick={handleBackToListChat}
                  >
                    <Undo2 className="w-7 h-7" />
                  </button>
                  <div className="w-full flex p-4 items-center">
                    {selectedUserChat.avatar ? (
                      <img
                        src={selectedUserChat.avatar}
                        alt={"Avatar pic"}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                    ) : (
                      <UserRound className="w-10 h-10 rounded-full bg-gray-400 p-1 mr-4" />
                    )}
                    <h2 className="text-lg font-semibold text-white">
                      {selectedUserChat.name}
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
                      type="private"
                      message={msg}
                      key={msg.id}
                      isSender={msg.authorId === user.id}
                    />
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 bg-[#16243B]/80 backdrop-blur-sm rounded-br-2xl">
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
    </main>
    // <div className="bg-[#385484] min-h-screen">
    // </div>
  );
};

export default PrivateChatPage;
