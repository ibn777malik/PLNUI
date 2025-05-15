const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '../data/properties.json');

exports.getAllProperties = (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  res.json(data);
};

exports.getPropertyById = (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const property = data.find(p => p["OFFER NO"] == req.params.id);
  if (!property) return res.status(404).json({ error: 'Property not found' });
  res.json(property);
};
