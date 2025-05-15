// ✅ backend/controllers/authController.js
const path = require('path');
const fs = require('fs');

const usersPath = path.join(__dirname, '../data/users.json');

exports.login = (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true, token: 'mock-token', user: { id: user.id, email: user.email } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};