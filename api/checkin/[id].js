const storage = require('../storage');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { id } = req.query;
      const { status, user } = req.body;
      
      const participantId = parseInt(id);
      const participant = storage.getParticipantById(participantId);
      
      if (!participant) {
        return res.status(404).json({ 
          success: false, 
          message: 'Teilnehmer nicht gefunden' 
        });
      }

      const timestamp = new Date().toLocaleString('de-DE');
      
      const updates = {
        status: status,
        checkInTime: null,
        checkOutTime: null,
        ausflugsTime: null,
        krankTime: null
      };
      
      // Set appropriate timestamp
      switch(status) {
        case 'present':
          updates.checkInTime = timestamp;
          break;
        case 'absent':
          updates.checkOutTime = timestamp;
          break;
        case 'ausflug':
          updates.ausflugsTime = timestamp;
          break;
        case 'krank':
          updates.krankTime = timestamp;
          break;
      }
      
      const updatedParticipant = storage.updateParticipant(participantId, updates);
      console.log(`Status update by ${user}: Participant ${participantId} -> ${status}`);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Status erfolgreich aktualisiert',
        participant: updatedParticipant
      });
    } catch (error) {
      console.error('Error in checkin/[id].js:', error);
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
