// In-memory storage for participants data
let participants = [];

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { participants: newParticipants, user } = req.body;
      
      if (!newParticipants || !Array.isArray(newParticipants)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Ungültige Teilnehmerdaten' 
        });
      }

      participants = newParticipants;
      
      return res.status(200).json({ 
        success: true, 
        message: 'Teilnehmer erfolgreich gespeichert',
        count: participants.length 
      });
    } catch (error) {
      console.error('Error in participants.js:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Fehler beim Speichern der Teilnehmer',
        error: error.message 
      });
    }
  }

  if (req.method === 'GET') {
    try {
      return res.status(200).json(participants);
    } catch (error) {
      console.error('Error in participants.js GET:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Fehler beim Laden der Teilnehmer',
        error: error.message 
      });
    }
  }

  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
};
