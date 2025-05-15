// backend/utils/fileHandler.js
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/properties.json');

module.exports = {
  readProperties: () => {
    return JSON.parse(fs.readFileSync(filePath));
  },
  getPropertyById: (id) => {
    const properties = JSON.parse(fs.readFileSync(filePath));
    return properties.find(p => p.id === id);
  }
};