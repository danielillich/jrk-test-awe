/ Shared storage for all API functions
let participants = [];

module.exports = {
  getParticipants: () => participants,
  setParticipants: (newParticipants) => {
    participants = newParticipants;
    return participants;
  },
  updateParticipant: (id, updates) => {
    const index = participants.findIndex(p => p.id === id);
    if (index !== -1) {
      participants[index] = { ...participants[index], ...updates };
      return participants[index];
    }
    return null;
  },
  getParticipantById: (id) => {
    return participants.find(p => p.id === id);
  }
};
