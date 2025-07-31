import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  console.log('Auth middleware - JWT_SECRET:', JWT_SECRET ? 'Present' : 'Missing');
  console.log('Auth middleware - Cookies:', req.cookies);
  console.log('Auth middleware - Authorization header:', req.headers.authorization);
  
  // Check for token in cookies first, then Authorization header
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    console.log('Auth middleware - No token found');
    return res.status(401).json({ 
      message: "Access denied - No token provided",
      error: "Token missing"
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Auth middleware - Token verified successfully');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ 
      message: "Invalid token",
      error: "Token verification failed"
    });
  }
};

export default authMiddleware;
