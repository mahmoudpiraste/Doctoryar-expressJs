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
    body('payment_method').isIn(['Cash', 'Online']).withMessage('Invalid payment method'),
    body('name').isString().withMessage('Patient Name is required'),
  ],
  async (req, res) => {
    console.log("Received data:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { patient_id, appointment_date, payment_method ,name} = req.body;

    try {
      const result = await db.query(
        'INSERT INTO appointments (patient_id, appointment_date, payment_method, name) VALUES (?, ?, ?, ?)',
        [patient_id, appointment_date, payment_method, name]
      );
      
   
      res.status(201).json({ message: 'Appointment scheduled successfully', appointmentId: result.insertId });
    } catch (err) {
      console.error('Error scheduling appointment:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);


// رزروهای یک روز خاص
router.get('/appointments/day', async (req, res) => {
  const { date } = req.query; // تاریخ انتخاب شده (به فرمت YYYY-MM-DD)

  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM appointments WHERE DATE(appointment_date) = ?',
      [date]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'No appointments found for the selected date' });
    }

    res.status(200).json(result); // بازگرداندن لیست رزروها
  } catch (err) {
    console.error('Error fetching appointments:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
