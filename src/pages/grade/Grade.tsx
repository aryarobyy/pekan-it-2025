import React from "react";
import Profile from "../../assets/images/profile2.jpg";

interface User { //sementara pake dummy dulu
  id:number
  name: string
  email: string
  avatar: string
}

// dummy
const friends = [
  {
    id: 1,
    name: "Rangkasatra",
    email: "rangkasatra@example.com",
    avatar: `${Profile}`,
  },
  {
    id: 2,
    name: "Rangkasatra1",
    email: "rangkasatra1@example.com",
    avatar: `${Profile}`,
  },
  {
    id: 3,
    name: "Rangkasatriya",
    email: "rangkasatriya@example.com",
    avatar: `${Profile}`,
  },
  {
    id: 4,
    name: "Rangkasatra",
    email: "rangkasatra2@example.com",
    avatar: `${Profile}`,
  },
  {
    id: 5,
    name: "Rangkasatran",
    email: "rangkasatran@example.com",
    avatar: `${Profile}`,
  },
  {
    id: 6,
    name: "Another User",
    email: "another.user@example.com",
    avatar: `${Profile}`,
  },
  {
    id: 7,
    name: "Yet Another",
    email: "yet.another@example.com",
    avatar: `${Profile}`,
  },
];
type StatCardProps = {
  title: string,
  content: string,
  tipColor: string
}

// stat card component
const StatCard: React.FC<StatCardProps> = ({ title, content, tipColor = "" }) => (
  <div className="bg-[rgba(217,217,217,0.2)] rounded-xl shadow-md w-full h-[4rem] flex items-center overflow-hidden">
    <div className={`w-2 h-full rounded-l-xl ${tipColor}`} />
    <div className="flex justify-between items-center w-full px-4 py-2">
      <span className="text-base text-white font-medium">{title}</span>
      <span className="text-2xl font-bold text-white">{content}</span>
    </div>
  </div>
);

type FriendListProps = {
  friend: User
}

// single friend list item component
const FriendListItem: React.FC<FriendListProps> = ({ friend }) => (
  <div className="flex items-center justify-between py-4 px-2 border-b border-gray-700/50">
    <div className="flex items-center gap-4">
      <img
        src={friend.avatar}
        alt={friend.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <span className="text-lg font-semibold text-white">{friend.name}</span>
    </div>
    <button className="text-lg font-bold text-gray-300 hover:text-yellow-400 transition-colors">
      GRADE
    </button>
  </div>
);

// main grade page
const GradePage = () => {
  return (
    <div className="text-white min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-24 sm:py-32">
        {/* User Grade and Stat */}
        <section className="flex flex-col md:flex-row items-center justify-around gap-8 mb-20">
          {/* Your Points */}
          <div className="text-center md:w-[20rem]">
            <p className="text-gray-200">Your Points</p>
            <p className="text-6xl font-bold">100</p>
          </div>

          {/* Grade Circle */}
          <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-800/50 rounded-full blur-2xl"></div>
            <div className="relative bg-black/10 w-40 h-40 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold">GRADE</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-col gap-4 w-full md:w-[20rem]">
            <StatCard title="Task Done" content="50" tipColor="bg-yellow-500" />
            <StatCard
              title="Pomodoro"
              content="1:00:00"
              tipColor="bg-blue-500"
            />
          </div>
        </section>

        {/* Friends List */}
        <section>
          {/* Title */}
          <div className="relative text-center mb-6">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-600/50"></div>
            <div className="relative inline-block py-2 px-4 bg-[#385484]">
              <h2 className="text-2xl font-bold text-center">
                Grade your Friends
              </h2>
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0
                                  border-l-[20px] border-l-transparent
                                  border-t-[20px] border-t-[#385484]
                                  border-r-[20px] border-r-transparent"
              ></div>
            </div>
          </div>

          {/* Friends List */}
          <div className="bg-gray-800/20 rounded-2xl p-4 sm:p-6 mt-8">
            {friends.map((friend) => (
              <FriendListItem key={friend.id} friend={friend} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default GradePage;
