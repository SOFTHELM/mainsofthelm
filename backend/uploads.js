const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Handle upload
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file)
    return res.json({ success: false, message: "No file uploaded" });

  const fileUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

  res.json({ success: true, url: fileUrl });
});

module.exports = router;
