import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ContactCard from "@/components/organisms/ContactCard";
import ContactModal from "@/components/organisms/ContactModal";
import ContactForm from "@/components/organisms/ContactForm";
import DeleteConfirmModal from "@/components/organisms/DeleteConfirmModal";
import StatusFilter from "@/components/molecules/StatusFilter";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { contactService } from "@/services/api/contactService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Contacts = () => {
  const { onMenuClick } = useOutletContext();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, statusFilter, searchQuery]);

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = [...contacts];

    if (statusFilter !== "All") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.company.toLowerCase().includes(query)
      );
    }

    setFilteredContacts(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleNewContact = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowModal(false);
    setShowForm(true);
  };

  const handleDeleteContact = (contact) => {
    setContactToDelete(contact);
    setShowModal(false);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await contactService.delete(contactToDelete.Id);
      await loadContacts();
      toast.success("Contact deleted successfully");
      setShowDelete(false);
      setContactToDelete(null);
    } catch (err) {
      toast.error("Failed to delete contact");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingContact) {
        await contactService.update(editingContact.Id, formData);
        toast.success("Contact updated successfully");
      } else {
        await contactService.create(formData);
        toast.success("Contact created successfully");
      }
      await loadContacts();
      setShowForm(false);
      setEditingContact(null);
    } catch (err) {
      toast.error("Failed to save contact");
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadContacts} />;

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Contacts"
        onSearch={handleSearch}
        showNewButton
        onNewClick={handleNewContact}
        newButtonLabel="New Contact"
        onMenuClick={onMenuClick}
      />

      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredContacts.length} {filteredContacts.length === 1 ? "Contact" : "Contacts"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your customer relationships
            </p>
          </div>

          <StatusFilter
            value={statusFilter}
            onChange={setStatusFilter}
            options={["All", "Lead", "Customer", "Active", "Inactive"]}
          />
        </div>

        <Button
          onClick={handleNewContact}
          variant="primary"
          className="sm:hidden w-full"
        >
          <ApperIcon name="Plus" size={18} />
          New Contact
        </Button>

        {filteredContacts.length === 0 ? (
          <Empty
            icon="Users"
            title="No contacts found"
            description="Start building relationships by adding your first contact."
            actionLabel="Add Contact"
            onAction={handleNewContact}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ContactCard contact={contact} onClick={handleContactClick} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <ContactModal
        contact={selectedContact}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedContact(null);
        }}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
      />

      <ContactForm
        contact={editingContact}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingContact(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
          setContactToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Contact?"
        message={`Are you sure you want to delete ${contactToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Contacts;