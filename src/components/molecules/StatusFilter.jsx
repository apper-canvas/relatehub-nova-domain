import { cn } from "@/utils/cn";

const StatusFilter = ({ value, onChange, options }) => {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
            value === option
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-secondary border border-gray-300 hover:bg-gray-50"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;