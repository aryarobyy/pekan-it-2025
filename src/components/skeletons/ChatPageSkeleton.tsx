import { ChatListSkeleton } from "@/components/skeletons/ChatListSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Undo2, UsersRound } from "lucide-react";

export default function ChatPageSkeleton() {
  return (
    <main className="pt-16 pb-16">
      <div className="max-w-4/5 mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-[#2D3748] rounded-2xl shadow-2xl flex md:h-[40rem] md:max-h-[40rem]">
          <aside
            className={"w-1/3 min-w-[300px] bg-[#16243B] rounded-l-2xl p-4 flex flex-col gap-4"}
          >
            <Skeleton className="w-[10rem] h-6" />
            <div className="relative">
              <Skeleton className="w-20 h-4" />
            </div>
            <div className="flex-grow overflow-y-auto">
              {Array(5)
                .fill(null)
                .map((_, idx) => (
                  <ChatListSkeleton key={idx} />
                ))}
            </div>
          </aside>

            {/* Chat Header */}
              <div className="relative z-10 flex flex-col h-full w-full">
                <header className="flex items-center p-4 border-b border-gray-700 bg-[#16243B]/80 backdrop-blur-sm rounded-tr-2xl gap-4">
                  <button
                    className="text-slate-100 p-2 cursor-pointer rounded-full hover:bg-[#16243B]/40 transition-all ease-in-out duration-300"
                    type="button"
                  >
                    <Undo2 className="w-7 h-7" />
                  </button>
                    <UsersRound className="w-10 h-10 rounded-full bg-gray-400 p-1" />
                    <Skeleton className="w-[10rem] h-7" />
                </header>
                </div>
        </div>
      </div>
    </main>
  );
}
