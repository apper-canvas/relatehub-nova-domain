import { cn } from "@/utils/cn";

const Avatar = ({ initials, size = "md", className }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg"
  };

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-amber-500",
    "bg-teal-500"
  ];

  const colorIndex = initials.charCodeAt(0) % colors.length;

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-semibold",
        sizes[size],
        colors[colorIndex],
        className
      )}
    >
      {initials}
    </div>
  );
};

export default Avatar;