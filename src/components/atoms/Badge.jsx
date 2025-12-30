import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", className }) => {
const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    customer: "bg-green-100 text-green-700",
    lead: "bg-blue-100 text-blue-700",
    active: "bg-blue-100 text-blue-700",
    inactive: "bg-gray-100 text-gray-700",
    prospecting: "bg-indigo-100 text-indigo-700",
    qualified: "bg-blue-100 text-blue-700",
    proposal: "bg-amber-100 text-amber-700",
    negotiation: "bg-orange-100 text-orange-700",
    closed: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide",
        variants[variant.toLowerCase()] || variants.default,
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;