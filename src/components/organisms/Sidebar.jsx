import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = () => {
const navigation = [
    { name: "Contacts", path: "", icon: "Users" },
    { name: "Companies", path: "companies", icon: "Building" },
    { name: "Deals", path: "deals", icon: "DollarSign" },
    { name: "Pipeline", path: "pipeline", icon: "BarChart3" },
    { name: "Activity", path: "activity", icon: "Activity" }
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[200px] bg-white border-r border-gray-200 h-screen">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center">
          <ApperIcon name="Users" size={20} className="text-white" />
        </div>
        <span className="font-bold text-lg text-gray-900">RelateHub</span>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={`/${item.path}`}
            end={item.path === ""}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-secondary hover:bg-gray-50"
              )
            }
          >
            <ApperIcon name={item.icon} size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;