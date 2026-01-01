const sharedData = require('./shared-data');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { participants: newParticipants, user, forceUpdate, timestamp } = req.body;
      
      if (!newParticipants || !Array.isArray(newParticipants)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Ungültige Upload-Daten' 
        });
      }

      sharedData.setParticipants(newParticipants);
      console.log(`Excel uploaded by ${user} at ${timestamp}: ${newParticipants.length} participants`);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Upload erfolgreich',
        count: newParticipants.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in upload.js:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Fehler beim Upload',
        error: error.message 
      });
    }
  }

  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
};
