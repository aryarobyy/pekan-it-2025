import React, { useEffect, useState } from "react";
import profilePic from "../../assets/images/profile.png";
import ProgressBar from "../ProgressBar";
import { MoreVertical } from "lucide-react";
import type { TodoType } from "../../types/todo";
import type { UserType } from "../../types/user";
import { getUserById } from "../../providers/userProvider";

interface TodoDisplayProps {
  todo?: TodoType;
  totalTodos: number;
  completedTodo: number;
}

const TodoDisplay: React.FC<TodoDisplayProps> = ({
  todo,
  totalTodos,
  completedTodo,
}) => {
  const [members, setMembers] = useState<UserType[]>([]);
  useEffect(() => {
    const fetchUser = async () => {
      if (todo?.users) {
        setMembers(todo.users);
      }
    };
    fetchUser();
  }, [todo]);

  if (!todo) return;

  return (
    <>
      <div className="flex flex-col gap-5 bg-primary w-[20rem] h-[14rem] rounded-4xl p-4 mx-5">
        <div className="flex flex-row justify-between items-center mb-2">
          <div className="flex -space-x-4">
            {members.slice(0, 5).map((m: UserType, index: number) => (
              <MemberAvatar
                key={m.id}
                img={m.avatar ?? profilePic}
                altText={m.username}
                zIndex={members.length - index}
              />
            ))}
          </div>
          <MoreVertical className="w-6 h-6 text-white" />
        </div>
        <Todo
          totalTodo={totalTodos}
          title={todo.title}
          completedTodo={completedTodo}
        />
      </div>
    </>
  );
};

type TodoProps = {
  title: string;
  totalTodo: number;
  completedTodo: number;
};

const Todo: React.FC<TodoProps> = ({ title, totalTodo, completedTodo }) => {
  const percentage = totalTodo === 0 ? 0 : parseFloat(((completedTodo / totalTodo) * 100).toFixed(1));
  return (
    <div className="flex flex-col">
      <h3 className="text-white text-2xl font-bold">{title}</h3>
      <ProgressBar completedPercentage={percentage} tasks={completedTodo} />
    </div>
  );
};

type MemberAvatarProps = {
  img: string;
  altText: string;
  zIndex: number;
};

const MemberAvatar: React.FC<MemberAvatarProps> = ({
  img,
  altText,
  zIndex,
}) => {
  return (
    //nanti di cek, maks 5
    <div
      className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white"
      style={{ zIndex: zIndex }}
    >
      <img src={img} alt={altText} className="w-full h-full object-cover" />
    </div>
  );
};

export default TodoDisplay;
