import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const CompanyModal = ({ company, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !company) return null;

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'secondary';
      case 'Prospect': return 'warning';
      default: return 'secondary';
    }
  };

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
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="Building" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
                <Badge variant={getStatusBadgeVariant(company.status)} className="mt-1">
                  {company.status}
                </Badge>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <ApperIcon name="Building" size={16} className="text-gray-400" />
                      <span className="text-gray-600">Industry:</span>
                      <span className="text-gray-900">{company.industry}</span>
                    </div>
                    
                    {company.website && (
                      <div className="flex items-center gap-3 text-sm">
                        <ApperIcon name="Globe" size={16} className="text-gray-400" />
                        <span className="text-gray-600">Website:</span>
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {company.website}
                        </a>
                      </div>
                    )}
                    
                    {company.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <ApperIcon name="Phone" size={16} className="text-gray-400" />
                        <span className="text-gray-600">Phone:</span>
                        <span className="text-gray-900">{company.phone}</span>
                      </div>
                    )}
                    
                    {company.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <ApperIcon name="Mail" size={16} className="text-gray-400" />
                        <span className="text-gray-600">Email:</span>
                        <a 
                          href={`mailto:${company.email}`}
                          className="text-primary hover:underline"
                        >
                          {company.email}
                        </a>
                      </div>
                    )}
                    
                    {company.address && (
                      <div className="flex items-start gap-3 text-sm">
                        <ApperIcon name="MapPin" size={16} className="text-gray-400 mt-0.5" />
                        <span className="text-gray-600">Address:</span>
                        <span className="text-gray-900">{company.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Company Details</h3>
                  <div className="space-y-3">
                    {company.employees && (
                      <div className="flex items-center gap-3 text-sm">
                        <ApperIcon name="Users" size={16} className="text-gray-400" />
                        <span className="text-gray-600">Employees:</span>
                        <span className="text-gray-900">{formatNumber(company.employees)}</span>
                      </div>
                    )}
                    
                    {company.revenue && (
                      <div className="flex items-center gap-3 text-sm">
                        <ApperIcon name="DollarSign" size={16} className="text-gray-400" />
                        <span className="text-gray-600">Revenue:</span>
                        <span className="text-gray-900">{formatCurrency(company.revenue)}</span>
                      </div>
                    )}
                    
                    {company.founded && (
                      <div className="flex items-center gap-3 text-sm">
                        <ApperIcon name="Calendar" size={16} className="text-gray-400" />
                        <span className="text-gray-600">Founded:</span>
                        <span className="text-gray-900">{company.founded}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 text-sm">
                      <ApperIcon name="Clock" size={16} className="text-gray-400" />
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">
                        {format(new Date(company.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {company.description && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{company.description}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-200">
            <Button onClick={() => onEdit(company)} variant="primary" className="flex-1">
              <ApperIcon name="Edit" size={16} />
              Edit Company
            </Button>
            <Button onClick={() => onDelete(company)} variant="danger" className="flex-1">
              <ApperIcon name="Trash2" size={16} />
              Delete
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompanyModal;