import React, { useEffect, useState, type ChangeEvent } from "react";
import { FriendStatus, type FriendReqType, type FriendType, type UserType as User } from "../../types/user";
import MailIconButton from "../../components/friend/MailButton";
import { ChevronDown, Search } from "lucide-react";
import { getFriends, getUsers, requestFriend, updateFriendStatus, } from "../../providers/userProvider";
import UserTile from "../../components/friend/UserTile";
import { useNavigate } from "react-router";

interface FriendPageProps {
  user: User | null;
}

const FindFriendsPage: React.FC<FriendPageProps> = ({ user }) => {
  const [view, setView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [friendsQuery, setFriendsQuery] = useState<FriendType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showFriendStatus, setShowFriendStatus] = useState(false);
  const [selectedFriendStatus, setSelectedFriendStatus] =
    useState<FriendStatus>("ACCEPTED");
  const [loading, setLoading] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const navigate = useNavigate();
  const [pendingFriend, setPendingFriend] = useState<FriendReqType[]>([])

  const friendStatusOptions: (typeof FriendStatus[keyof typeof FriendStatus])[] = [
    FriendStatus.PENDING,
    FriendStatus.ACCEPTED,
    FriendStatus.BLOCKED,
    FriendStatus.REJECTED,
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if (!user?.id) return;
        const data = await getUsers();
        const filtered = data.filter(u => u.id !== user.id);
        setUsers(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchFriend = async () => {
      if (!user?.id) return;

      try {
        setLoadingFriends(true);
        const data = await getFriends(user.id, selectedFriendStatus);
        console.log("Anasnja",data)
        setFriendsQuery(data);
      } catch (e) {
        console.error("Error fetching friends:", e);
        setFriendsQuery([]);
      } finally {
        setLoadingFriends(false);
      }
    };
    fetchFriend();
  }, [user?.id, selectedFriendStatus]);

  useEffect(() => {
    const fetchFriend = async () => {
      if (!user?.id) return;

      try {
        setLoadingFriends(true);
        const data = await getFriends(user.id, FriendStatus.PENDING);
        console.log("Anasnja",data)
        setPendingFriend(data);
      } catch (e) {
        console.error("Error fetching friends:", e);
        setPendingFriend([]);
      } finally {
        setLoadingFriends(false);
      }
    };
    fetchFriend();
  }, [user?.id, selectedFriendStatus]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchQuery(input);
    if (input.length > 0 && view !== true) {
      setView(true);
    }
  };

  const handleStatusSelect = (status: FriendStatus) => {
    setSelectedFriendStatus(status);
    setShowFriendStatus(false);
  };

  const searchResults = searchQuery
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleAddFriend = async (receiverId: number) => {
    try {
      if (!user?.id) return;

      const data = {
        requesterId: user.id,
        receiverId: receiverId,
        status: FriendStatus.PENDING,
      };
      const res = await requestFriend(data);
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAccFriend = async (requesterId: number) => {
    try {
      if (!user?.id) return;
      console.log("sndsaasn")
      console.log(requesterId)
      console.log(user.id)
      const data = {
        requesterId: requesterId,
        receiverId: user.id,
        status: FriendStatus.ACCEPTED,
      };
      const res = await updateFriendStatus(data);
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };

  // Reject sama block lu atur aja uinya, function dan siap
  const handleRejected = async (requesterId: number) => {
    try {
      if (!user?.id) return;
      console.log(requesterId)
      console.log(user.id)
      const data = {
        requesterId: requesterId,
        receiverId: user.id,
        status: FriendStatus.REJECTED,
      };
      const res = await updateFriendStatus(data);
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBlocked = async (requesterId: number) => {
    try {
      if (!user?.id) return;
      console.log(requesterId)
      console.log(user.id)
      const data = {
        requesterId: requesterId,
        receiverId: user.id,
        status: FriendStatus.BLOCKED,
      };
      const res = await updateFriendStatus(data);
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };

  const renderLeftPanelContent = () => {
    return (
      <>
        <div className="p-2 flex-shrink-0">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search or new chat"
          />
        </div>
        {searchQuery && (
          <div className="overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <UserTile
                  key={user.id}
                  user={user}
                  status={FriendStatus.PENDING}
                  onClick={() => handleAddFriend(user.id)}
                />
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                No users found
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8">
      <main className="max-w-6xl mx-auto pt-20">
        <div className="flex justify-end mb-4">
          <MailIconButton
            notification={true}
            isOpen={view === false}
            onClick={() => setView((v) => !v)}
          />
        </div>

        <div
          className="bg-[#425C7F] rounded-2xl shadow-2xl grid md:grid-cols-2 overflow-hidden"
          style={{ height: "calc(100vh - 250px)" }}
        >
          {/* Left Panel: Search or Friend Requests */}
          <div className="border-r border-gray-600/50 flex flex-col min-h-0">
            {renderLeftPanelContent()}
          </div>

          {/* Right Panel: Friend List */}
          <div className="flex flex-col min-h-0">
            <div className="bg-gray-600/50 text-white font-bold text-center py-3 rounded-tr-lg flex-shrink-0">
              <h1 className="mb-3">Friend List</h1>

              {/* Dropdown */}
              <div className="relative px-4">
                <div
                  onClick={() => setShowFriendStatus(!showFriendStatus)}
                  className="w-full bg-slate-300/90 text-slate-500 rounded-2xl px-4 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-300 transition-all duration-300"
                >
                  <span className="capitalize">{selectedFriendStatus}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      showFriendStatus ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {showFriendStatus && (
                  <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-lg shadow-lg z-10">
                    {friendStatusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusSelect(status)}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg capitalize transition-colors"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Friends List */}
            <div className="overflow-y-auto p-2 space-y-1 flex-1">
              {loadingFriends ? (
                <div className="text-center py-4">Loading friends...</div>
              ) : friendsQuery.length > 0 ? (
                friendsQuery.map((friend) => (
                <UserTile
                  key={friend.id}
                  user={friend}
                  status={selectedFriendStatus}
                  variant="acc"
                  onClick={() => {
                    if (selectedFriendStatus === FriendStatus.PENDING) {
                      handleAccFriend(friend.id);
                    } else {
                      navigate("/");
                    }
                  }}
                />
                ))
              ) : (
                <div className="text-center py-4 text-gray-400">
                  No {selectedFriendStatus} friends found
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

type SearchBarProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
}) => (
  <div className="relative w-full">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
      <Search />
    </div>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-200 text-gray-800 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
    />
  </div>
);

export default FindFriendsPage;
