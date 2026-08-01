const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()
const { protect, authorize } = require('../Middleware/protectRoute')
const { addAncs, getAncs, getAncsById, updateAncs, deleteAncs } = require('../Controllers/ansController')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`
    cb(null, name)
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.gif']
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, allowed.includes(ext))
  }
})

router.post('/ancs', protect, authorize('admin'), upload.single('image'), addAncs)
router.get('/ancs', getAncs)
router.get('/ancs/:id', getAncsById)
router.put('/ancs/:id', protect, authorize('admin'), upload.single('image'), updateAncs)
router.delete('/ancs/:id', protect, authorize('admin'), deleteAncs)

module.exports = router;