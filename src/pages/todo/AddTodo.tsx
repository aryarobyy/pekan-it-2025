import { useEffect, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Color, TodoStatus, type PostTodoType } from "../../types/todo";
import type { UserType } from "../../types/user";
import { MyButton } from "../../components/Button";
import { addTodo } from "../../providers/TodoProvider";
import { useNavigate } from "react-router";
import MyPopup from "../../components/Popup";
import MustLogin from "@/components/MustLogin";

const colors = ["#00FFFF", "#385484", "#DDB742", "#16243B", "#5CE3B1"];

const ColorsName = [
  Color.cyan, // cyan
  Color.dark_blue, // dark_blue
  Color.yellow, // yellow
  Color.black, // black
  Color.sage, // sage
];

type AddTodoProps = {
  user: UserType | null;
};

const AddTodo: React.FC<AddTodoProps> = ({ user }) => {
  const navigate = useNavigate();

  const [taskType, setTaskType] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [inputs, setInputs] = useState({
    title: "",
    status: TodoStatus.uncompleted,
    description: "",
    icon: "wow", //belum dipikirin
    deadline: "",
    color: ColorsName[0],
  });

  const selectedColor = colors[selectedColorIndex];
  const colorsName = ColorsName[selectedColorIndex];

  useEffect(() => {
    setInputs((p) => ({
      ...p,
      color: ColorsName[selectedColorIndex],
      deadline: deadline,
      userId: user?.id,
    }));
  }, [selectedColorIndex, deadline, user?.id]);

  const handleColorSelection = (index: number) => {
    if (index >= 0 && index < ColorsName.length) {
      setSelectedColorIndex(index);
    } else {
      console.error("Invalid color index provided:", index);
    }
  };

  const handleAddTodo = async () => {
    if (!user) {
      setErrorMessage("User is required");
      setShowErrorPopup(true);
      return;
    }

    if (!inputs.title.trim()) {
      setErrorMessage("Title is required");
      setShowErrorPopup(true);
      return;
    }

    if (!inputs.deadline) {
      setErrorMessage("Deadline is required");
      setShowErrorPopup(true);
      return;
    }

    const todoData: PostTodoType = {
      ...inputs,
      userId: user.id,
      priority: 1,
      title: inputs.title.trim(),
      isChecked: false,
      description: inputs.description.trim(),
      // users: [user]
    };

    try {
      const data = await addTodo(todoData);
      console.log("API Response:", data);
      setShowSuccessPopup(true);

      setInputs({
        title: "",
        status: TodoStatus.uncompleted,
        description: "",
        icon: "wow",
        deadline: deadline,
        color: ColorsName[0],
      });
      setDeadline("");
      setSelectedColorIndex(0);

      setTimeout(() => {
        navigate("/todo");
      }, 1500);
    } catch (e: any) {
      console.error("Full error object:", e);
      console.error("Error response:", e.response?.data);

      const errorMsg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        e.message ||
        "Gagal membuat todolist. Coba lagi.";
      setErrorMessage(errorMsg);
      setShowErrorPopup(true);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br flex flex-col items-center justify-center p-4">
        <h1 className="text-white text-2xl font-semibold text-center mb-6">
          Todolist
        </h1>
        <div className="w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl bg-[#4E7B97] backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-2xl mx-auto">
          <div className="space-y-6">
            {/* Task Type Section */}
            <div className="flex bg-slate-600/50 rounded-2xl p-1 gap-1">
              <button
                onClick={() => setTaskType(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  !taskType
                    ? "bg-amber-400 text-slate-800 shadow-lg"
                    : "text-white hover:bg-slate-500/50"
                }`}
              >
                Pribadi
              </button>
              <button
                onClick={() => setTaskType(true)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  taskType
                    ? "bg-amber-400 text-slate-800 shadow-lg"
                    : "text-white hover:bg-slate-500/50"
                }`}
              >
                Group
              </button>
            </div>

            {/* Title Section */}
            <div>
              <input
                type="text"
                value={inputs.title}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Masukkan Judul"
                className="w-full bg-slate-300/90 text-slate-700 placeholder-slate-500 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                maxLength={100}
              />
            </div>

            {/* Description Section */}
            <div>
              <textarea
                value={inputs.description}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Masukkan Deskripsi"
                className="w-full bg-slate-300/90 text-slate-700 placeholder-slate-500 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 resize-none"
                rows={3}
                maxLength={255}
              />
            </div>

            {/* Deadline Section */}
            <div className="relative">
              <div
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full bg-slate-300/90 text-slate-500 rounded-2xl px-4 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-300 transition-all duration-300"
              >
                <span className={deadline ? "text-slate-700" : ""}>
                  {deadline
                    ? new Date(deadline).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Masukkan deadline"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${showDatePicker ? "rotate-180" : ""}`}
                />
              </div>
              {showDatePicker && (
                <input
                  type="date"
                  value={deadline}
                  min={new Date().toISOString().split("T")[0]} // ✅ Prevent past dates
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    setShowDatePicker(false);
                  }}
                  className="absolute top-full left-0 w-full mt-1 bg-white rounded-xl px-4 py-3 shadow-lg z-10 border-0 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              )}
            </div>

            {/* Color and Member Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <div>
                <h3 className="text-white font-medium mb-2 capitalize">
                  Color: {colorsName.replace("_", " ")}
                </h3>
                <div className="flex gap-2">
                  {colors.map((color, index) => (
                    <button
                      key={`${color}-${index}`}
                      onClick={() => handleColorSelection(index)}
                      className={`w-8 h-8 rounded-lg transition-all duration-300 ${
                        selectedColor === color
                          ? "ring-2 ring-white ring-offset-2 ring-offset-slate-500 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select ${ColorsName[index]} color`}
                    />
                  ))}
                </div>
              </div>

              {taskType && (
                <div>
                  <h3 className="text-white font-medium mb-3">Member</h3>
                  <MyButton text="Add Member" icon={Plus} variant="accent" />
                </div>
              )}
            </div>

            <MyButton
              text="Create Task"
              className="w-full"
              variant="accent"
              onClick={handleAddTodo}
            />
          </div>
        </div>
      </div>
      {!user && <MustLogin />}

      {showSuccessPopup && (
        <MyPopup
          isOpen={showSuccessPopup}
          message="Task berhasil dibuat!"
          onClose={() => setShowSuccessPopup(false)}
          title="Success"
          variant="success"
        />
      )}

      {showErrorPopup && (
        <MyPopup
          isOpen={showErrorPopup}
          message={errorMessage}
          onClose={() => setShowErrorPopup(false)}
          title="Error"
          variant="error"
        />
      )}
    </>
  );
};

export default AddTodo;
