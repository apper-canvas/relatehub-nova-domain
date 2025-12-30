import dealsData from "../mockData/deals.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let deals = [...dealsData];

export const dealService = {
  getAll: async () => {
    await delay(300);
    return [...deals];
  },

  getById: async (id) => {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id));
    return deal ? { ...deal } : null;
  },

  getByContactId: async (contactId) => {
    await delay(250);
    return deals.filter(d => d.contactId === parseInt(contactId));
  },

  create: async (dealData) => {
    await delay(400);
    const maxId = deals.reduce((max, d) => Math.max(max, d.Id), 0);
    const newDeal = {
      ...dealData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  update: async (id, dealData) => {
    await delay(400);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      deals[index] = {
        ...deals[index],
        ...dealData,
        Id: deals[index].Id,
        updatedAt: new Date().toISOString()
      };
      return { ...deals[index] };
    }
    return null;
  },

  updateStage: async (id, stage) => {
    await delay(300);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      deals[index] = {
        ...deals[index],
        stage,
        updatedAt: new Date().toISOString()
      };
      return { ...deals[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay(300);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      deals.splice(index, 1);
      return true;
    }
    return false;
  },

  getByStage: async (stage) => {
    await delay(200);
    return deals.filter(d => d.stage === stage);
  }
};