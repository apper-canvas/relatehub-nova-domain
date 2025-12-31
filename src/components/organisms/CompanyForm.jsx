import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const CompanyForm = ({ company, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    employees: '',
    revenue: '',
    founded: '',
    description: '',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        industry: company.industry || '',
        website: company.website || '',
        phone: company.phone || '',
        email: company.email || '',
        address: company.address || '',
        employees: company.employees?.toString() || '',
        revenue: company.revenue?.toString() || '',
        founded: company.founded?.toString() || '',
        description: company.description || '',
        status: company.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        industry: '',
        website: '',
        phone: '',
        email: '',
        address: '',
        employees: '',
        revenue: '',
        founded: '',
        description: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [company, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid URL (starting with http:// or https://)';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        employees: formData.employees ? parseInt(formData.employees) : null,
        revenue: formData.revenue ? parseInt(formData.revenue) : null,
        founded: formData.founded ? parseInt(formData.founded) : null
      };
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {company ? 'Edit Company' : 'New Company'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0">
              <FormField
                label="Company Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />

              <FormField
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                error={errors.industry}
                required
              />

              <FormField
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                error={errors.website}
                placeholder="https://company.com"
              />

              <FormField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="+1 (555) 123-4567"
              />

              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="contact@company.com"
              />

              <div className="md:col-span-2">
                <FormField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                  placeholder="123 Business St, City, State 12345"
                />
              </div>

              <FormField
                label="Employees"
                name="employees"
                type="number"
                value={formData.employees}
                onChange={handleChange}
                error={errors.employees}
                placeholder="100"
              />

              <FormField
                label="Annual Revenue"
                name="revenue"
                type="number"
                value={formData.revenue}
                onChange={handleChange}
                error={errors.revenue}
                placeholder="1000000"
              />

              <FormField
                label="Founded Year"
                name="founded"
                type="number"
                value={formData.founded}
                onChange={handleChange}
                error={errors.founded}
                placeholder="2000"
                min="1800"
                max={new Date().getFullYear()}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Prospect">Prospect</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <FormField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={errors.description}
                  multiline
                  placeholder="Brief description of the company..."
                />
              </div>
            </div>

            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Saving...' : company ? 'Update Company' : 'Create Company'}
              </Button>
              <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompanyForm;