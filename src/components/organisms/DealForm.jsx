import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { contactService } from "@/services/api/contactService";

const DealForm = ({ deal, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "Lead",
    contactId: ""
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"];

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "Lead",
        contactId: deal.contactId?.toString() || ""
      });
    }
  }, [deal]);

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (err) {
      console.error("Failed to load contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.value.trim()) {
      newErrors.value = "Value is required";
    } else if (isNaN(formData.value) || parseFloat(formData.value) <= 0) {
      newErrors.value = "Value must be a positive number";
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        title: formData.title.trim(),
        value: parseFloat(formData.value),
        stage: formData.stage,
        contactId: parseInt(formData.contactId)
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading contacts...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Deal Title"
        error={errors.title}
        required
      >
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter deal title"
        />
      </FormField>

      <FormField
        label="Value ($)"
        error={errors.value}
        required
      >
        <input
          type="number"
          value={formData.value}
          onChange={(e) => handleInputChange("value", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="0"
          min="0"
          step="0.01"
        />
      </FormField>

      <FormField
        label="Contact"
        error={errors.contactId}
        required
      >
        <select
          value={formData.contactId}
          onChange={(e) => handleInputChange("contactId", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Select a contact</option>
          {contacts.map((contact) => (
            <option key={contact.Id} value={contact.Id}>
              {contact.name} - {contact.company}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Stage"
        error={errors.stage}
        required
      >
        <select
          value={formData.stage}
          onChange={(e) => handleInputChange("stage", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {stages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </FormField>

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : deal ? "Update Deal" : "Create Deal"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default DealForm;