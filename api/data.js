const sharedData = require('./shared-data');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const participants = sharedData.getParticipants();
      console.log('GET /api/data - returning participants:', participants.length);
      return res.status(200).json(participants);
    } catch (error) {
      console.error('Error in data.js:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Fehler beim Laden der Daten',
        error: error.message 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
