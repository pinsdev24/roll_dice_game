const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    //return res.redirect('/login')
    return res.status(401).json({ message: 'No token provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    //res.redirect('/login')
    res.status(401).json({ message: 'Invalid token' });
  }
};