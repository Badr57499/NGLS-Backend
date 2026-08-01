const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../Middleware/protectRoute');
const { getVideos, addVideo } = require('../Controllers/videosController');

router.post('/videos', protect, authorize('admin', 'editor'), addVideo);
router.get('/videos', getVideos);

module.exports = router;
