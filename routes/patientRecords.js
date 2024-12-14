// ثبت سوابق بیمار


const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../models/db');

// ثبت سوابق بیمار
router.post(
  '/patient-records',
  [
    body('patient_id').isInt().withMessage('Patient ID is required'),
    body('visit_date').isISO8601().withMessage('Valid visit date is required'),
    body('visit_details').isLength({ min: 1 }).withMessage('Visit details are required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { patient_id, visit_date, visit_details, next_visit_date } = req.body;

    try {
      const result = await db.query(
        'INSERT INTO patient_records (patient_id, visit_date, visit_details, next_visit_date) VALUES (?, ?, ?, ?)',
        [patient_id, visit_date, visit_details, next_visit_date || null]
      );
      res.status(201).json({ message: 'Patient record created successfully', recordId: result.insertId });
    } catch (err) {
      console.error('Error creating patient record:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
