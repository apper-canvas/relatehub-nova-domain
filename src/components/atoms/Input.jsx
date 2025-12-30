import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text",
  className,
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        "placeholder:text-gray-400",
        error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;