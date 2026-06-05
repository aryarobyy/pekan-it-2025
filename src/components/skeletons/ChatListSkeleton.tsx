import { Skeleton } from "../ui/skeleton";

export function ChatListSkeleton() {
  return (
    <div className={`flex items-center p-3 cursor-pointer`}>
      <Skeleton className="w-12 h-12 rounded-full mr-4" />
      <div className="flex flex-col gap-1">
        <Skeleton className="w-14 h-4" />
        <Skeleton className="w-[5rem] h-3" />
      </div>
    </div>
  );
}
