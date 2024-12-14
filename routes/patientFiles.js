// routes/patientFiles.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const db = require('../models/db');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique file name
  }
});
const upload = multer({ storage: storage });

// ایجاد پرونده جدید برای بیمار با آپلود فایل
router.post(
  '/patient-files',
  upload.single('file'), // 'file' is the name of the file field in the form
  [
    body('patient_id').isInt().withMessage('Patient ID is required'),
    body('file_description').isLength({ min: 1 }).withMessage('File description is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { patient_id, file_description } = req.body;
    const filePath = req.file ? req.file.path : null; // Path to the uploaded file

    try {
      const result = await db.query(
        'INSERT INTO patient_files (patient_id, file_description, file_path) VALUES (?, ?, ?)',
        [patient_id, file_description, filePath]
      );
      res.status(201).json({ message: 'Patient file created successfully', fileId: result.insertId });
    } catch (err) {
      console.error('Error creating patient file:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
