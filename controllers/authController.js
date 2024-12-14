const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).send({ error: 'All fields are required' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.createUser(email, hashedPassword, firstName, lastName, phone || null);
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).send({ error: 'Database error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required' });
    }
    
    const user = await User.getUserByEmail(email);
    
    if (!user) {
      return res.status(401).send({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await User.updateLastLogin(user.id);

    res.send({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        lastLogin: user.last_login
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ error: 'Server error' });
  }
};

exports.logout = (req, res) => {
  // اگر از کوکی‌ها استفاده می‌کنید، کوکی JWT را پاک کنید
  res.clearCookie('token');
  return res.status(200).send({ message: 'Logged out successfully' });
};

exports.checkLogin = (req, res) => {
  if (req.user) {
      return res.status(200).send({ message: 'User is logged in', user: req.user });
  }
  return res.status(401).send({ error: 'User is not logged in' });
};

