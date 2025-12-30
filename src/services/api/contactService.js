import contactsData from "../mockData/contacts.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let contacts = [...contactsData];

export const contactService = {
  getAll: async () => {
    await delay(300);
    return [...contacts];
  },

  getById: async (id) => {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id));
    return contact ? { ...contact } : null;
  },

  create: async (contactData) => {
    await delay(400);
    const maxId = contacts.reduce((max, c) => Math.max(max, c.Id), 0);
    const newContact = {
      ...contactData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  update: async (id, contactData) => {
    await delay(400);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      contacts[index] = {
        ...contacts[index],
        ...contactData,
        Id: contacts[index].Id,
        updatedAt: new Date().toISOString()
      };
      return { ...contacts[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay(300);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      contacts.splice(index, 1);
      return true;
    }
    return false;
  },

  search: async (query) => {
    await delay(200);
    const lowerQuery = query.toLowerCase();
    return contacts.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.email.toLowerCase().includes(lowerQuery) ||
      c.company.toLowerCase().includes(lowerQuery)
    );
  },

  filterByStatus: async (status) => {
    await delay(200);
    if (!status || status === "All") return [...contacts];
    return contacts.filter(c => c.status === status);
  }
};