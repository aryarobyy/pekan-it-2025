import React from "react";
import type { Color } from "../../types/todo";

type TodoTileProps = {
  id: number;
  label: string;
  date?: string;
  isChecked: boolean;
  color: Color;
  icon?: string
  onChange?: (checked: boolean) => void;
};

const TodoTile: React.FC<TodoTileProps> = ({
  id,
  label,
  date,
  isChecked,
  onChange,
  icon,
  color,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(onChange){
      onChange(event.target.checked);
    }
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
        return "bg-[#00FFFF]"; // sage
    }
  };

  return (
    <>
      <div
        className={`${
          isChecked ? "bg-primary" : "bg-grey-accent"
        } rounded-lg sm:rounded-xl shadow-md w-full h-12 sm:h-14 md:h-16 lg:h-[4.5rem] flex items-center overflow-hidden`}
      >
        <div className={` ${icon ? 'w-12' : 'w-6' }  h-full ${getColor(color)} flex items-center justify-center flex-shrink-0`}>
          {icon ? 
            <img
              src={icon}
              alt={icon}
              className="w-6 h-6"
            />
          :
            ""
          }
        </div>

        <div className="flex justify-between items-center w-full min-w-0 px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4">
          <span
            className={`text-sm sm:text-base md:text-lg lg:text-xl font-medium truncate pr-3 sm:pr-4 flex-1 ${
              isChecked ? "text-yellow-400" : "text-primary"
            }`}
          >
            {label}
          </span>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-shrink-0">
            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-thin text-primary font-helvetica whitespace-nowrap">
              {date}
            </span>
            <input
              type="checkbox"
              id={String(id)}
              checked={isChecked}
              onChange={handleChange}
              className={`h-6 w-6 rounded-md border-2 transition duration-200 appearance-none relative
                ${isChecked ? "bg-primary border-primary" : "bg-white border-gray-300"}  checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/30 flex-shrink-0 checked:after:content-['✓'] checked:after:absolute checked:after:left-1 checked:after:top-0.5 checked:after:text-yellow-400 checked:after:text-lg  checked:after:font-bold checked:after:leading-none
              `}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoTile;
