import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import serverlessExpress from '@vendia/serverless-express';

// Import authentication routes
import authRoutes from './routes/auth.routes';

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Register authentication routes
app.use('/auth', authRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Hello from Express on AWS Lambda!',
    timestamp: new Date().toISOString()
  });
});

// Sample ping route
app.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

// Sample protected route (just for demonstration)
app.get('/api/protected', (req: Request, res: Response) => {
  // In a real app, you would validate JWT here
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.status(401).json({ message: 'Unauthorized - No token provided' });
    return;
  }
  
  // Just a demonstration - in a real app, you'd verify the token
  res.status(200).json({ 
    message: 'This is protected data',
    user: 'example_user_id'
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Lambda handler export - much simpler with @vendia/serverless-express
export const handler = serverlessExpress({ app });

// Run locally if not in Lambda
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log('Routes:');
    console.log('- GET /            - Hello world message');
    console.log('- GET /ping        - Simple ping endpoint');
    console.log('- GET /health      - Health check endpoint');
    console.log('- GET /api/protected - Protected route example (requires Authorization header)');
  });
}
