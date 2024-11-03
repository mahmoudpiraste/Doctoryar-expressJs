const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../models/db');
const  {authenticate}  = require('../middlewares/authMiddleware'); // token check

// ثبت بیمار جدید
router.post(
  '/patients',
  authenticate,
  [
    body('first_name').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('last_name').trim().isLength({ min: 1 }).withMessage('Last name is required'),
    body('phone').trim().isLength({ min: 1 }).withMessage('Phone number is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('insurance_type').optional().isIn(['آزاد','تامین اجتماعی','خدمات درمانی','نیروهای مسلح','طلایی','سایر']).withMessage('Invalid insurance type'),
    body('insurance_number').optional().isLength({ min: 1 }).withMessage('Insurance number is required if insurance type is provided'),
    body('national_id').trim().isLength({ min: 1 }).withMessage('National ID is required') // اصلاح نام پارامتر
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, phone, email, insurance_type, insurance_number, national_id } = req.body;

    try {
      const [result] = await db.query(
        'INSERT INTO patients (first_name, last_name, phone, email, insurance_type, insurance_number, national_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [first_name, last_name, phone, email, insurance_type || 'آزاد', insurance_number || null, national_id]
      );
      res.status(201).json({ message: 'Patient registered successfully', patientId: result.insertId });
    } catch (err) {
      console.error('Error registering patient:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);


// دریافت تمامی بیماران
router.get('/patients', authenticate,  async (req, res) => {
  try {
    const [patients] = await db.query('SELECT * FROM patients');
    res.status(200).json(patients);
  } catch (err) {
    console.error('Error fetching patients:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
