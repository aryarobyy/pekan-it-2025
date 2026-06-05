import { FriendStatus, type FriendType, type UserType } from "../../types/user";
import ProfilePic from "../../assets/images/profile2.jpg"

type UserListProps = {
  user: UserType | FriendType;
  status: FriendStatus;
  variant?: "acc";
  onClick: () => void;
};

const UserTile: React.FC<UserListProps> = ({ user, onClick, status, variant }) => {

const renderButton = () => {
  if (variant === "acc" && status === FriendStatus.PENDING) {
    return (
      <button
        onClick={onClick}
        className="bg-gray-600 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-300"
      >
        Accept
      </button>
    );
  }

  switch (status) {
    case FriendStatus.ACCEPTED:
      return (
        <button
          onClick={onClick}
          className="bg-gray-600 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-300"
        >
          Chat
        </button>
      );
    case FriendStatus.PENDING:
      return (
        <button
          onClick={onClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-300"
        >
          + Teman
        </button>
      );
    case FriendStatus.REJECTED:
      return (
        <button
          disabled
          className="bg-red-400 text-white font-semibold px-4 py-2 rounded-lg text-sm cursor-not-allowed"
        >
          Ditolak
        </button>
      );
    case FriendStatus.BLOCKED:
    default:
      return (
        <button
          disabled
          className="bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg text-sm cursor-not-allowed"
        >
          Buka Block
        </button>
      );
  }
};

return (
  <div className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors duration-200">
    <div className="flex items-center gap-4">
      <img
        src={user.avatar ?? ProfilePic}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <span className="font-semibold text-white">{user.name}</span>
    </div>
    {renderButton()}
  </div>
);

}

export default UserTile