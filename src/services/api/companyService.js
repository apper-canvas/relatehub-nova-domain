import companiesData from '../mockData/companies.json';

// Mock data storage
let companies = [...companiesData];
let nextId = Math.max(...companies.map(c => c.Id)) + 1;

// Simulate network delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const companyService = {
  async getAll() {
    await delay(300);
    return [...companies];
  },

  async getById(id) {
    await delay(200);
    const company = companies.find(c => c.Id === id);
    if (!company) {
      throw new Error('Company not found');
    }
    return { ...company };
  },

  async create(companyData) {
    await delay(500);
    const newCompany = {
      ...companyData,
      Id: nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    companies.push(newCompany);
    return { ...newCompany };
  },

  async update(id, companyData) {
    await delay(500);
    const index = companies.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    
    const updatedCompany = {
      ...companies[index],
      ...companyData,
      Id: id,
      updatedAt: new Date().toISOString()
    };
    
    companies[index] = updatedCompany;
    return { ...updatedCompany };
  },

  async delete(id) {
    await delay(400);
    const index = companies.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    companies.splice(index, 1);
    return true;
  }
};