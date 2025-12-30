import activitiesData from "../mockData/activities.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let activities = [...activitiesData];

export const activityService = {
  getAll: async () => {
    await delay(300);
    return [...activities].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  },

  getById: async (id) => {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id));
    return activity ? { ...activity } : null;
  },

  getByContactId: async (contactId) => {
    await delay(250);
    return activities
      .filter(a => a.contactId === parseInt(contactId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  create: async (activityData) => {
    await delay(400);
    const maxId = activities.reduce((max, a) => Math.max(max, a.Id), 0);
    const newActivity = {
      ...activityData,
      Id: maxId + 1,
      timestamp: new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  update: async (id, activityData) => {
    await delay(400);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      activities[index] = {
        ...activities[index],
        ...activityData,
        Id: activities[index].Id
      };
      return { ...activities[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay(300);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      activities.splice(index, 1);
      return true;
    }
    return false;
  },

  filterByType: async (type) => {
    await delay(200);
    if (!type || type === "All") return await activityService.getAll();
    return activities
      .filter(a => a.type === type)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
};