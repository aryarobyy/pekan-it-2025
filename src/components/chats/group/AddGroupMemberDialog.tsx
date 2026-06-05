import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { GROUP_CHAT_EP, USER_EP } from "@/core/endpoints";
import { useFetchData, usePostData } from "@/hooks/useFetchData";
import useToast from "@/hooks/useHotToast";
import type { ResponseApiType } from "@/types/apiType";
import type { GroupchatMemberType, GroupchatType } from "@/types/groupchat";
import type { UserType } from "@/types/user";
import { UsersRound, X } from "lucide-react";
import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type PropsType = {
  selectedGroup: GroupchatType | null;
  setSelectedGroup: Dispatch<SetStateAction<GroupchatType | null>>;
  userId: number;
  isOpen: boolean;
  handleOpen: () => void;
};

const AddGroupMemberDialog = React.memo(
  ({
    isOpen,
    handleOpen,
    selectedGroup,
    setSelectedGroup,
    userId,
  }: PropsType) => {
    const [selectedUser, setSelectedUser] = useState<UserType[]>([]);
    const [availableUserToJoinGroup, setAvailableUserToJoinGroup] = useState<
      UserType[]
    >([]);
    const [
      { apiData: userFriends, loading: loadingGetUserFriend }
    ] = useFetchData<ResponseApiType<UserType[]>>({
      url: `${USER_EP}/friends/${userId}`,
      params: {
        status: "accepted",
      },
    });

    const { postData: addMember } = usePostData<
      ResponseApiType<{
        addedMembers: GroupchatMemberType[];
        alreadyJoinedUsers: GroupchatMemberType[];
      }>
    >(`${GROUP_CHAT_EP}/member`);

    const { pushToast, updateToast } = useToast();

    useEffect(() => {
      const handleJoinedUser = () => {
        if (availableUserToJoinGroup.length > 0 && selectedGroup?.members) {
          const joinedMemberIds = new Set(
            selectedGroup.members.map((member) => member.userId)
          );
          const filteredUserFriends = availableUserToJoinGroup.filter(
            (user) => {
              return !joinedMemberIds.has(user.id);
            }
          );
          setAvailableUserToJoinGroup(filteredUserFriends);
        } else {
          console.warn(
            "userFriends.data atau selectedGroup.members tidak tersedia."
          );
        }
      };

      if (userFriends.data) {
        setAvailableUserToJoinGroup(() => userFriends.data);
        handleJoinedUser();
      }
      return () => {
        handleJoinedUser();
      };
    }, [isOpen, userFriends.code]);

    const handleOpenChange = () => {
      setSelectedUser([]);
      setAvailableUserToJoinGroup([]);
      handleOpen();
    };

    const handleSelectMember = (member: UserType) => {
      setSelectedUser((prev) => [...prev, member]);
      const filteredFriends = [
        ...availableUserToJoinGroup.filter((user) => user.id !== member.id),
      ];
      setAvailableUserToJoinGroup(filteredFriends);
    };

    const handleUnselectMember = (member: UserType) => {
      const newSelectedUser = [
        ...selectedUser.filter((user) => user.id !== member.id),
      ];
      setSelectedUser(newSelectedUser);
      setAvailableUserToJoinGroup((prev) => ([...prev, member]));
    };

    const handleSubmit = async () => {
      const toastId = pushToast({
        message: "Menambahkan teman...",
        isLoading: true,
      });

      try {
        let data: unknown = [...selectedUser.map((el) => el.id)];
        data = JSON.stringify(data);
        const newMember = await addMember(
          {
            userId: data,
          },
          `${selectedGroup?.id}?manyMember=true`
        );
        updateToast({
          toastId,
          message: "Berhasil",
        });

        setSelectedGroup((prev) => {
          if (prev) {
            return {
              ...prev,
              members: prev.members
                ? [
                    ...prev.members,
                    ...(Array.isArray(newMember.data.addedMembers)
                      ? newMember.data.addedMembers
                      : [newMember.data.addedMembers]),
                  ]
                : Array.isArray(newMember.data.addedMembers)
                ? newMember.data.addedMembers
                : [newMember.data.addedMembers],
            };
          } else {
            return null;
          }
        });

        if (newMember.data.alreadyJoinedUsers.length > 0) {
          newMember.data.alreadyJoinedUsers.map((member) =>
            console.warn(
              `User with ID ${member.id} already joined Group ${member.groupId}`
            )
          );
        }
      } catch (error) {
        console.error(error);
        updateToast({
          toastId,
          message: "Gagal menambahkan teman.",
          isError: true,
        });
      } finally {
        handleOpenChange();
      }
    };

    return (
      <Dialog onOpenChange={handleOpenChange} open={isOpen}>
        <DialogContent className="sm:max-w-[425px] text-slate-50 bg-[#16243B]">
          <DialogHeader>
            <DialogTitle>Tambahkan teman</DialogTitle>
            <DialogDescription className="text-slate-300">
              Tambahkan temanmu kedalam grup untuk memulai diskusi denganmu!
            </DialogDescription>
          </DialogHeader>
          <div className="columns-2 gap-2 max-h-[8rem] overflow-y-auto">
            {selectedUser.length !== 0 &&
              selectedUser.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 rounded-full my-1"
                  onClick={() => handleUnselectMember(member)}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={"Avatar pic"}
                      className="w-7 h-7 rounded-full mr-4"
                    />
                  ) : (
                    <UsersRound className="w-7 h-7 rounded-full bg-gray-400 p-1" />
                  )}
                  <p className="text-sm font-semibold text-white">
                    {member.name}
                  </p>
                  <div className="hover:bg-[#333d50] rounded-full  cursor-pointer text-slate-50">
                    <X />
                  </div>
                </div>
              ))}
          </div>
          {isOpen && (
            <div className="bg-[#16243B] max-h-[25rem] overflow-auto">
              {loadingGetUserFriend ? (
                [1, 2, 3].map((_, idx) => <FriendListSkeleton key={idx} />)
              ) : !availableUserToJoinGroup ||
                availableUserToJoinGroup.length === 0 ? (
                <p className="text-center">
                  Tidak ada teman yang dapat dimasukkan kedalam grup.
                </p>
              ) : (
                availableUserToJoinGroup?.map((user) => (
                  <FriendList
                    data={user}
                    key={user.id}
                    handleSelectUser={handleSelectMember}
                  />
                ))
              )}
            </div>
          )}

          {selectedUser.length !== 0 && (
            <DialogFooter>
              <Button
                className="cursor-pointer"
                onClick={handleSubmit}
                type="submit"
              >
                Tambahkan
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }
);
export default AddGroupMemberDialog;

type PropsFriendListType = {
  data: UserType;
  handleSelectUser: (user: UserType) => void;
};

function FriendList({ data, handleSelectUser }: PropsFriendListType) {
  return (
    <div
      className="flex items-center gap-2 hover:bg-[#333d50] cursor-pointer p-2 rounded-md"
      onClick={() => handleSelectUser(data)}
    >
      {data.avatar ? (
        <img
          src={data.avatar}
          alt={"Avatar pic"}
          className="w-10 h-10 rounded-full mr-4"
        />
      ) : (
        <UsersRound className="w-10 h-10 rounded-full bg-gray-400 p-1" />
      )}
      <h2 className="text-lg font-semibold text-white">{data.name}</h2>
    </div>
  );
}

function FriendListSkeleton() {
  return (
    <div className="flex items-center gap-2 hover:bg-[#333d50] p-2 rounded-md">
      <Skeleton className="w-10 h-10 rounded-full" />
      <Skeleton className="w-[6rem] h-5 rounded-sm" />
    </div>
  )
}