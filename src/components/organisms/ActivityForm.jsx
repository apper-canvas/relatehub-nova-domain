import { useState } from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const ActivityForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: "Call",
    description: "",
    timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm")
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.description.trim()) {
      onSubmit({
        ...formData,
        timestamp: new Date(formData.timestamp).toISOString()
      });
      setFormData({
        type: "Call",
        description: "",
        timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm")
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Activity Type">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="Call">Call</option>
            <option value="Email">Email</option>
            <option value="Meeting">Meeting</option>
          </select>
        </FormField>

        <FormField label="Date & Time">
          <input
            type="datetime-local"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </FormField>
      </div>

      <FormField label="Notes">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="What happened during this activity?"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
        />
      </FormField>

      <div className="flex gap-2">
        <Button type="submit" variant="primary" size="sm">
          <ApperIcon name="Check" size={16} />
          Save Activity
        </Button>
        <Button type="button" onClick={onCancel} variant="secondary" size="sm">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;