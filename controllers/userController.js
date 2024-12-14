const userModel = require('../models/userModel');

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: 'Database error' });
  }
};
