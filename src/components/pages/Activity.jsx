import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { cn } from "@/utils/cn";

const Activity = () => {
  const { onMenuClick } = useOutletContext();
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [activitiesData, contactsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll()
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact?.name || "Unknown Contact";
  };

  const filteredActivities = typeFilter === "All"
    ? activities
    : activities.filter(a => a.type === typeFilter);

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-background">
      <Header title="Activity" onMenuClick={onMenuClick} />

      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Activity Timeline</h2>
            <p className="text-sm text-gray-600 mt-1">
              All interactions across your contacts
            </p>
          </div>

          <div className="flex gap-2">
            {["All", "Call", "Email", "Meeting"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                  typeFilter === type
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-secondary border border-gray-300 hover:bg-gray-50"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <Empty
            icon="Activity"
            title="No activities found"
            description="Start logging interactions to build a complete timeline."
          />
        ) : (
          <div className="max-w-4xl">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div className="space-y-6">
                {filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative pl-12"
                  >
                    <div
                      className={cn(
                        "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center",
                        activity.type === "Call" && "bg-blue-100 text-blue-600",
                        activity.type === "Email" && "bg-green-100 text-green-600",
                        activity.type === "Meeting" && "bg-purple-100 text-purple-600"
                      )}
                    >
                      <ApperIcon
                        name={
                          activity.type === "Call" ? "Phone" :
                          activity.type === "Email" ? "Mail" : "Calendar"
                        }
                        size={16}
                      />
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {activity.type}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {getContactName(activity.contactId)}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(activity.timestamp), "MMM d, yyyy")}
                          <br />
                          {format(new Date(activity.timestamp), "h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{activity.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;