import { Router, Request, Response } from "express";
import { authService } from "../services/auth.service";
import { jwtAuthMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * Register a new user
 * POST /auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    
    // Register the user
    const result = await authService.register(email, password);
    
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * Login user
 * POST /auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    
    // Validate user credentials
    const user = await authService.validateUser(email, password);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Generate JWT token
    const result = authService.login(user);
    
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * Get user profile (protected route)
 * GET /auth/profile
 */
router.get('/profile', jwtAuthMiddleware, (req: Request, res: Response) => {
  // User is available from the middleware
  res.status(200).json(req.user);
});

/**
 * Refresh access token using refresh token
 * POST /auth/refresh
 */
router.post('/refresh', (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }
    
    const result = authService.refreshToken(refresh_token);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

export default router;
