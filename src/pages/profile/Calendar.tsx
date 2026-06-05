import { useEffect, useState } from "react";
import type { Color, TodoType } from "../../types/todo";

interface CalendarProps {
  todos: TodoType[];
}

const Calendar: React.FC<CalendarProps> = ({ todos }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<(Date | null)[]>([]);
  const [tasksByDate, setTasksByDate] = useState<Map<string, TodoType[]>>(new Map());

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const toDateKey = (date: Date) => date.toISOString().split("T")[0]; 

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const newDays: (Date | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) newDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) newDays.push(new Date(year, month, i));

    setCalendarDays(newDays);
  }, [currentDate]);

  useEffect(() => {
    const taskMap = new Map<string, TodoType[]>();
    todos.forEach((task) => {
      const key = toDateKey(new Date(task.deadline));
      if (!taskMap.has(key)) taskMap.set(key, []);
      taskMap.get(key)!.push(task);
    });
    setTasksByDate(taskMap);
  }, [todos]);

  const changeMonth = (offset: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const getColor = (color: Color) => {
    switch (color) {
      case "cyan":
        return "bg-[#5CE3B1]";
      case "dark_blue":
        return "bg-[#16243B]";
      case "yellow":
        return "bg-[#DDB742]";
      case "black":
        return "bg-[#385484]";
      default:
        return "bg-[#00FFFF]";
    }
  };

  console.log(todos)

  return (
    <div className="bg-tertiary p-4 sm:p-6 rounded-2xl md:rounded-3xl shadow-lg mt-4 md:mt-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="text-white text-2xl font-bold hover:text-amber-400 transition-colors"
        >
          ‹
        </button>
        <h2 className="text-xl font-bold text-white">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="text-white text-2xl font-bold hover:text-amber-400 transition-colors"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-300 text-sm py-2"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const key = day ? toDateKey(day) : "";
          const tasksOnDay = key && tasksByDate.has(key) ? tasksByDate.get(key)! : [];
          const isToday = day?.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`h-16 sm:h-20 flex flex-col items-center justify-center rounded-lg relative transition-colors ${
                day ? "hover:bg-[#16243B]" : ""
              } ${isToday ? "bg-[#16243B]" : ""}`}
            >
              {day && (
                <>
                <span className="text-base text-white">{day.getDate()}</span>
                {tasksOnDay.length > 0 && (
                  <div className="absolute bottom-2 flex items-center justify-center gap-1">
                    {tasksOnDay.slice(0, 3).map((task) => {
                      console.log("Task color:", task.color);
                      console.log("Task color:", getColor(task.color));
                      return (
                        <div
                          key={task.id}
                          className={`w-1.5 h-1.5 rounded-full ${getColor(task.color)}`}
                        ></div>
                      );
                    })}
                  </div>
                )}
              </>

              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;