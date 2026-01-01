// In-memory storage for participants data
let participants = [];

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
      const { id } = req.query;
      const { status, user } = req.body;
      
      const participantId = parseInt(id);
      const participant = participants.find(p => p.id === participantId);
      
      if (!participant) {
        return res.status(404).json({ 
          success: false, 
          message: 'Teilnehmer nicht gefunden' 
        });
      }

      // Update participant status
      participant.status = status;
      const timestamp = new Date().toLocaleString('de-DE');
      
      // Clear all timestamps first
      participant.checkInTime = null;
      participant.checkOutTime = null;
      participant.ausflugsTime = null;
      participant.krankTime = null;
      
      // Set appropriate timestamp
      switch(status) {
        case 'present':
          participant.checkInTime = timestamp;
          break;
        case 'absent':
          participant.checkOutTime = timestamp;
          break;
        case 'ausflug':
          participant.ausflugsTime = timestamp;
          break;
        case 'krank':
          participant.krankTime = timestamp;
          break;
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'Status erfolgreich aktualisiert',
        participant: participant
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
