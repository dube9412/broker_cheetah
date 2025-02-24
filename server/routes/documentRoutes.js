const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadDocument } = require('../controllers/documentController');
const path = require('path');

// Setup storage
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Upload route
router.post('/upload', upload.single('file'), uploadDocument);

module.exports = router;
