import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

const MobileSidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: "Contacts", path: "", icon: "Users" },
    { name: "Companies", path: "companies", icon: "Building" },
    { name: "Deals", path: "deals", icon: "DollarSign" },
    { name: "Pipeline", path: "pipeline", icon: "BarChart3" },
    { name: "Activity", path: "activity", icon: "Activity" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 w-64 h-full bg-white z-50 lg:hidden shadow-xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" size={20} className="text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900">RelateHub</span>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <ApperIcon name="X" size={24} />
              </button>
            </div>
            
            <nav className="px-3 py-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={`/${item.path}`}
                  end={item.path === ""}
                  onClick={onClose}
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;