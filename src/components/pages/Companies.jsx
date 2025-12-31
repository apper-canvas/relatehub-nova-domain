import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Header from '@/components/organisms/Header';
import CompanyModal from '@/components/organisms/CompanyModal';
import CompanyForm from '@/components/organisms/CompanyForm';
import DeleteConfirmModal from '@/components/organisms/DeleteConfirmModal';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { companyService } from '@/services/api/companyService';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deleteCompany, setDeleteCompany] = useState(null);
  
  const { onMenuClick } = useOutletContext();

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchQuery]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = [...companies];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query) ||
        company.email?.toLowerCase().includes(query) ||
        company.phone?.includes(query)
      );
    }

    setFilteredCompanies(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleNewCompany = () => {
    setEditingCompany(null);
    setIsFormOpen(true);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
    setIsModalOpen(false);
  };

  const handleDeleteCompany = (company) => {
    setDeleteCompany(company);
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteCompany) return;

    try {
      await companyService.delete(deleteCompany.Id);
      setCompanies(prev => prev.filter(c => c.Id !== deleteCompany.Id));
      toast.success('Company deleted successfully');
      setDeleteCompany(null);
    } catch (error) {
      toast.error('Failed to delete company');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCompany) {
        const updated = await companyService.update(editingCompany.Id, formData);
        setCompanies(prev => prev.map(c => c.Id === editingCompany.Id ? updated : c));
        toast.success('Company updated successfully');
      } else {
        const created = await companyService.create(formData);
        setCompanies(prev => [created, ...prev]);
        toast.success('Company created successfully');
      }
      setIsFormOpen(false);
      setEditingCompany(null);
    } catch (error) {
      toast.error(`Failed to ${editingCompany ? 'update' : 'create'} company`);
      throw error;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'secondary';
      case 'Prospect': return 'warning';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (!num) return null;
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(num);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadCompanies} />;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Header
        title="Companies"
        onSearch={handleSearch}
        showNewButton
        onNewClick={handleNewCompany}
        newButtonLabel="New Company"
        onMenuClick={onMenuClick}
      />

      <div className="flex-1 overflow-auto p-4 lg:p-6">
        {filteredCompanies.length === 0 ? (
          companies.length === 0 ? (
            <Empty
              icon="Building"
              title="No companies yet"
              description="Start building your business network by adding companies"
              action={{
                label: "Add First Company",
                onClick: handleNewCompany
              }}
            />
          ) : (
            <Empty
              icon="Search"
              title="No companies found"
              description={`No companies match "${searchQuery}"`}
            />
          )
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'}
              </div>
              
              <Button onClick={handleNewCompany} variant="primary" className="sm:hidden">
                <ApperIcon name="Plus" size={18} />
                New Company
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company, index) => (
                <motion.div
                  key={company.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCompanyClick(company)}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                        <ApperIcon name="Building" size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{company.name}</h3>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(company.status)}>
                      {company.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {company.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ApperIcon name="Mail" size={14} />
                        <span className="line-clamp-1">{company.email}</span>
                      </div>
                    )}
                    
                    {company.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ApperIcon name="Phone" size={14} />
                        <span>{company.phone}</span>
                      </div>
                    )}
                    
                    {company.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ApperIcon name="Globe" size={14} />
                        <span className="line-clamp-1">{company.website}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {company.employees && (
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Users" size={12} />
                          <span>{formatNumber(company.employees)}</span>
                        </div>
                      )}
                      {company.revenue && (
                        <div className="flex items-center gap-1">
                          <ApperIcon name="DollarSign" size={12} />
                          <span>{formatCurrency(company.revenue)}</span>
                        </div>
                      )}
                    </div>
                    
                    <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ApperIcon name="ChevronRight" size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <CompanyModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompany(null);
        }}
        onEdit={handleEditCompany}
        onDelete={handleDeleteCompany}
      />

      <CompanyForm
        company={editingCompany}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCompany(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmModal
        isOpen={!!deleteCompany}
        onClose={() => setDeleteCompany(null)}
        onConfirm={confirmDelete}
        title="Delete Company"
        message={`Are you sure you want to delete "${deleteCompany?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Companies;