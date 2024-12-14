const db = require('./db');

exports.createUser = async (email, password, firstName, lastName, phone) => {
  try {
    const query = 'INSERT INTO users (email, password, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [email, password, firstName, lastName, phone || null]);
    return result;
  } catch (error) {
    console.error('Error creating user:', error); // Log detailed error
    throw error;
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching user by email:', error); // Log detailed error
    throw error;
  }
};

exports.updateLastLogin = async (userId) => {
  try {
    const query = 'UPDATE users SET last_login = NOW() WHERE id = ?';
    await db.execute(query, [userId]);
  } catch (error) {
    console.error('Error updating last login:', error); // Log detailed error
    throw error;
  }
};

exports.getAllUsers = async () => {
  try {
    const query = 'SELECT * FROM users';
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    console.error('Error fetching all users:', error); // Log detailed error
    throw error;
  }
};
