import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import DealModal from "@/components/organisms/DealModal";
import DeleteConfirmModal from "@/components/organisms/DeleteConfirmModal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import SearchBar from "@/components/molecules/SearchBar";
import StatusFilter from "@/components/molecules/StatusFilter";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";

const Deals = () => {
  const { onMenuClick } = useOutletContext();
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [dealModal, setDealModal] = useState({ isOpen: false, deal: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, deal: null });
  const [submitting, setSubmitting] = useState(false);

  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"];

  const stageColors = {
    "Lead": "info",
    "Qualified": "qualified",
    "Proposal": "proposal",
    "Negotiation": "negotiation",
    "Closed": "closed"
  };

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

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact?.name || "Unknown";
  };

  const getContactCompany = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact?.company || "";
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         getContactName(deal.contactId).toLowerCase().includes(searchQuery.toLowerCase()) ||
                         getContactCompany(deal.contactId).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = !selectedStage || deal.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const handleCreateDeal = () => {
    setDealModal({ isOpen: true, deal: null });
  };

  const handleEditDeal = (deal) => {
    setDealModal({ isOpen: true, deal });
  };

  const handleDeleteDeal = (deal) => {
    setDeleteModal({ isOpen: true, deal });
  };

  const handleModalClose = () => {
    setDealModal({ isOpen: false, deal: null });
  };

  const handleDealSubmit = async (dealData) => {
    setSubmitting(true);
    try {
      if (dealModal.deal) {
        await dealService.update(dealModal.deal.Id, dealData);
        toast.success("Deal updated successfully");
      } else {
        await dealService.create(dealData);
        toast.success("Deal created successfully");
      }
      await loadData();
      setDealModal({ isOpen: false, deal: null });
    } catch (err) {
      toast.error(err.message || "Failed to save deal");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await dealService.delete(deleteModal.deal.Id);
      toast.success("Deal deleted successfully");
      await loadData();
      setDeleteModal({ isOpen: false, deal: null });
    } catch (err) {
      toast.error(err.message || "Failed to delete deal");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, deal: null });
  };

  const calculateTotalValue = () => {
    return filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Deals" 
        onMenuClick={onMenuClick}
        showNewButton
        onNewClick={handleCreateDeal}
        newButtonLabel="New Deal"
      />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600">Total Deals</div>
            <div className="text-2xl font-bold text-gray-900">{filteredDeals.length}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600">Total Value</div>
            <div className="text-2xl font-bold text-primary">
              ${calculateTotalValue().toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600">Avg Deal Size</div>
            <div className="text-2xl font-bold text-gray-900">
              ${filteredDeals.length ? Math.round(calculateTotalValue() / filteredDeals.length).toLocaleString() : '0'}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search deals, contacts, companies..."
              onSearch={setSearchQuery}
            />
          </div>
          <StatusFilter
            label="Stage"
            value={selectedStage}
            onChange={setSelectedStage}
            options={[
              { value: "", label: "All Stages" },
              ...stages.map(stage => ({ value: stage, label: stage }))
            ]}
          />
        </div>

        {/* Mobile Create Button */}
        <Button
          onClick={handleCreateDeal}
          variant="primary"
          className="sm:hidden fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-10"
        >
          <ApperIcon name="Plus" size={24} />
        </Button>

        {/* Deals List */}
        {filteredDeals.length === 0 ? (
          <Empty
            icon="DollarSign"
            title={searchQuery || selectedStage ? "No deals found" : "No deals yet"}
            description={searchQuery || selectedStage ? "Try adjusting your filters" : "Create your first deal to get started"}
            actionLabel={searchQuery || selectedStage ? undefined : "Create Deal"}
            onAction={searchQuery || selectedStage ? undefined : handleCreateDeal}
          />
        ) : (
          <div className="grid gap-4">
            {filteredDeals.map((deal) => (
              <motion.div
                key={deal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{deal.title}</h3>
                      <Badge variant={stageColors[deal.stage] || "default"}>
                        {deal.stage}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="DollarSign" size={16} />
                        <span className="font-medium text-primary">
                          ${deal.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="User" size={16} />
                        <span>{getContactName(deal.contactId)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Building2" size={16} />
                        <span>{getContactCompany(deal.contactId) || "No company"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      onClick={() => handleEditDeal(deal)}
                      variant="secondary"
                      className="p-2"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteDeal(deal)}
                      variant="secondary"
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <DealModal
        isOpen={dealModal.isOpen}
        onClose={handleModalClose}
        deal={dealModal.deal}
        onSubmit={handleDealSubmit}
        isSubmitting={submitting}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Deal"
        message={`Are you sure you want to delete "${deleteModal.deal?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Deals;