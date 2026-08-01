const Video = require('../Models/videos');

const extractYoutubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/, 
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch videos', error: error.message });
  }
};

const addVideo = async (req, res) => {
  try {
    const { title, description, url } = req.body;
    if (!title || !url) {
      return res.status(400).json({ message: 'Title and YouTube URL are required' });
    }

    const youtubeId = extractYoutubeId(url);
    if (!youtubeId) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }

    const video = new Video({
      title,
      description,
      url,
      youtubeId,
      createdBy: req.user.id,
      createdByRole: req.user.role,
    });
    await video.save();

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add video', error: error.message });
  }
};

module.exports = { getVideos, addVideo };
