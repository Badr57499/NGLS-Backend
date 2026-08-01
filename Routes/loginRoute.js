const express = require('express');
const router = express.Router();
const loginController = require('../Controllers/loginController');
const { protect } = require('../Middleware/protectRoute');

router.post('/login', loginController);
router.get('/me', protect, (req, res) => {
  return res.status(200).json({
    user: {
      username: req.user.username,
      role: req.user.role,
      id: req.user.id,
    },
  });
});

module.exports = router;