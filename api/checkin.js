module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      // Get ID from request body instead of URL
      const { id, status, user } = req.body;
      
      if (!global.participants) {
        global.participants = [];
      }
      
      const participantId = parseInt(id);
      const participantIndex = global.participants.findIndex(p => p.id === participantId);
      
      if (participantIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Teilnehmer nicht gefunden' 
        });
      }

      const timestamp = new Date().toLocaleString('de-DE');
      
      // Update participant status
      global.participants[participantIndex].status = status;
      global.participants[participantIndex].checkInTime = null;
      global.participants[participantIndex].checkOutTime = null;
      global.participants[participantIndex].ausflugsTime = null;
      global.participants[participantIndex].krankTime = null;
      
      // Set appropriate timestamp
      switch(status) {
        case 'present':
          global.participants[participantIndex].checkInTime = timestamp;
          break;
        case 'absent':
          global.participants[participantIndex].checkOutTime = timestamp;
          break;
        case 'ausflug':
          global.participants[participantIndex].ausflugsTime = timestamp;
          break;
        case 'krank':
          global.participants[participantIndex].krankTime = timestamp;
          break;
      }
      
      console.log(`Status update by ${user}: Participant ${participantId} -> ${status}`);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Status erfolgreich aktualisiert',
        participant: global.participants[participantIndex]
      });
    } catch (error) {
      console.error('Error in checkin.js:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Fehler beim Status-Update',
        error: error.message 
      });
    }
  }

  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
};
