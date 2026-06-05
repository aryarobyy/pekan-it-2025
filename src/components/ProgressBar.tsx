type ProgressBarProps = {
  tasks: number;
  completedPercentage: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  tasks,
  completedPercentage,
}) => {
  const remainingPercentage = 100 - completedPercentage;

  return (
    <div className="mt-2 sm:mt-3 md:mt-4">
      <p className="text-xs sm:text-sm md:text-base text-gray-200 mb-2 sm:mb-3 font-medium">
        {tasks} Tasks | {completedPercentage}% Complete
      </p>

      <div className="w-full h-2 rounded-full bg-gray-600 relative overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-white to-gray-100 rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${completedPercentage}%` }}
        ></div>
        <div
          className="h-full bg-gray-500 rounded-r-full absolute top-0 right-0 transition-all duration-700 ease-out"
          style={{ width: `${remainingPercentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center mt-1 sm:mt-2">
        <span className="text-xs text-gray-400">0%</span>
        <span className="text-xs text-gray-400">100%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
