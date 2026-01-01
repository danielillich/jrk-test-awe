// Shared data storage
if (!global.appData) {
  global.appData = {
    participants: []
  };
}

module.exports = {
  getParticipants: () => global.appData.participants,
  setParticipants: (participants) => {
    global.appData.participants = participants;
    console.log('Participants updated:', participants.length);
    return global.appData.participants;
  },
  updateParticipant: (id, updates) => {
    const index = global.appData.participants.findIndex(p => p.id === id);
    if (index !== -1) {
      global.appData.participants[index] = { ...global.appData.participants[index], ...updates };
      console.log('Participant updated:', id, updates);
      return global.appData.participants[index];
    }
    return null;
  }
};
