import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import { activityService } from "@/services/api/activityService";
import { dealService } from "@/services/api/dealService";
import ActivityForm from "./ActivityForm";
import DealCard from "./DealCard";

const ContactModal = ({ contact, isOpen, onClose, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [activities, setActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);

  useEffect(() => {
    if (isOpen && contact) {
      loadContactData();
    }
  }, [isOpen, contact]);

  const loadContactData = async () => {
    setLoading(true);
    try {
      const [activitiesData, dealsData] = await Promise.all([
        activityService.getByContactId(contact.Id),
        dealService.getByContactId(contact.Id)
      ]);
      setActivities(activitiesData);
      setDeals(dealsData);
    } catch (error) {
      console.error("Error loading contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivitySubmit = async (activityData) => {
    await activityService.create({
      ...activityData,
      contactId: contact.Id
    });
    setShowActivityForm(false);
    loadContactData();
  };

  if (!isOpen || !contact) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar initials={contact.avatar} size="lg" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{contact.name}</h2>
                <p className="text-sm text-gray-600">{contact.company}</p>
              </div>
              <Badge variant={contact.status.toLowerCase()}>
                {contact.status}
              </Badge>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6">
              {["info", "timeline", "deals"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "py-3 px-2 text-sm font-medium border-b-2 transition-colors capitalize",
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "info" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <ApperIcon name="Mail" size={18} className="text-gray-400" />
                      <span className="text-gray-900">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ApperIcon name="Phone" size={18} className="text-gray-400" />
                      <span className="text-gray-900">{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ApperIcon name="Building" size={18} className="text-gray-400" />
                      <span className="text-gray-900">{contact.company}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created</span>
                      <span className="text-gray-900">
                        {format(new Date(contact.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="text-gray-900">
                        {format(new Date(contact.updatedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={() => onEdit(contact)} variant="primary">
                    <ApperIcon name="Edit" size={16} />
                    Edit Contact
                  </Button>
                  <Button onClick={() => onDelete(contact)} variant="danger">
                    <ApperIcon name="Trash2" size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Activity Timeline
                  </h3>
                  <Button
                    onClick={() => setShowActivityForm(!showActivityForm)}
                    variant="primary"
                    size="sm"
                  >
                    <ApperIcon name="Plus" size={16} />
                    Log Activity
                  </Button>
                </div>

                {showActivityForm && (
                  <ActivityForm
                    onSubmit={handleActivitySubmit}
                    onCancel={() => setShowActivityForm(false)}
                  />
                )}

                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading activities...</div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No activities yet</div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.Id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            activity.type === "Call" && "bg-blue-100 text-blue-600",
                            activity.type === "Email" && "bg-green-100 text-green-600",
                            activity.type === "Meeting" && "bg-purple-100 text-purple-600"
                          )}>
                            <ApperIcon
                              name={
                                activity.type === "Call" ? "Phone" :
                                activity.type === "Email" ? "Mail" : "Calendar"
                              }
                              size={16}
                            />
                          </div>
                          {activities[activities.length - 1].Id !== activity.Id && (
                            <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{activity.type}</span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "deals" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Associated Deals
                </h3>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading deals...</div>
                ) : deals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No deals yet</div>
                ) : (
                  <div className="grid gap-3">
                    {deals.map((deal) => (
                      <DealCard key={deal.Id} deal={deal} contactName={contact.name} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default ContactModal;