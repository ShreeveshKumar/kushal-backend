const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log("hit");
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: "false", error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Token successfully verified");
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: "false", error: 'Token expired' });
    }
    return res.status(401).json({ success: "false", error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
