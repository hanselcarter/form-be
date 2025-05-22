import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { usersService } from '../services/users.service';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * JWT Authentication middleware
 * Verifies the JWT token from the Authorization header
 */
export const jwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized - No token provided' });
      return;
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      res.status(401).json({ message: 'Unauthorized - Invalid token' });
      return;
    }

    // Find the user by ID from the token
    const user = usersService.findByEmail(decoded.email);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized - User not found' });
      return;
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized - Token validation failed' });
  }
};
