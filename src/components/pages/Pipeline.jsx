import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import DealCard from "@/components/organisms/DealCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";

const Pipeline = () => {
  const { onMenuClick } = useOutletContext();
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact?.name || "Unknown";
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, stage) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== stage) {
      try {
        await dealService.updateStage(draggedDeal.Id, stage);
        await loadData();
        toast.success(`Deal moved to ${stage}`);
      } catch (err) {
        toast.error("Failed to update deal");
      }
    }
    setDraggedDeal(null);
  };

  const calculateStageValue = (stage) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-background">
      <Header title="Pipeline" onMenuClick={onMenuClick} />

      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sales Pipeline</h2>
          <p className="text-sm text-gray-600 mt-1">
            Drag deals between stages to update their status
          </p>
        </div>

        {deals.length === 0 ? (
          <Empty
            icon="BarChart3"
            title="No deals in pipeline"
            description="Start adding deals to track your sales progress."
          />
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {stages.map((stage) => {
                const stageDeals = getDealsByStage(stage);
                const stageValue = calculateStageValue(stage);

                return (
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-shrink-0 w-[280px]"
                  >
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, stage)}
                      className="bg-gray-50 rounded-lg p-3 min-h-[600px]"
                    >
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{stage}</h3>
                          <span className="text-sm text-gray-600">
                            {stageDeals.length}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-primary">
                          ${stageValue.toLocaleString()}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {stageDeals.length === 0 ? (
                          <div className="text-center py-8 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                            Drop deals here
                          </div>
                        ) : (
                          stageDeals.map((deal) => (
                            <div
                              key={deal.Id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, deal)}
                              className="cursor-move"
                            >
                              <DealCard
                                deal={deal}
                                contactName={getContactName(deal.contactId)}
                                isDragging={draggedDeal?.Id === deal.Id}
                              />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pipeline;