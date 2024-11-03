const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  console.log('Token in authMiddleware:', token);

  if (!token) return res.status(401).send({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);
    req.user = decoded;
    next();
  } catch (ex) {
    console.error('Token verification failed:', ex);
    res.status(400).send({ error: 'Invalid token' });
  }
};
