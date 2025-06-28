const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Użytkownik nie istnieje.' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;