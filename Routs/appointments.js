//رزرو وقت
// routes/appointments.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../models/db');

// رزرو وقت جدید
router.post(
  '/appointments',
  [
    body('patient_id').isInt().withMessage('Patient ID is required'),
    body('appointment_date').isISO8601().withMessage('Valid appointment date is required'),
    body('payment_method').isIn(['Cash', 'Online']).withMessage('Invalid payment method')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { patient_id, appointment_date, payment_method } = req.body;

    try {
      const result = await db.query(
        'INSERT INTO appointments (patient_id, appointment_date, payment_method) VALUES (?, ?, ?)',
        [patient_id, appointment_date, payment_method]
      );
      res.status(201).json({ message: 'Appointment scheduled successfully', appointmentId: result.insertId });
    } catch (err) {
      console.error('Error scheduling appointment:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
