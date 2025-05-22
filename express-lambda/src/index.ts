import express from "express";
import type { Request, Response, NextFunction } from "express";
import serverlessExpress from "@vendia/serverless-express";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Register authentication routes
app.use("/auth", authRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello from Express on AWS Lambda!",
    timestamp: new Date().toISOString(),
  });
});

// Sample ping route
app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

export const handler = serverlessExpress({ app });

// Run locally if not in Lambda
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log("Routes:");
    console.log("- GET /            - Hello world message");
    console.log("- GET /ping        - Simple ping endpoint");
    console.log("- GET /health      - Health check endpoint");
    console.log("- GET /auth/profile - Protected route (requires JWT token)");
    console.log("- POST /auth/register - Register a new user");
    console.log("- POST /auth/login    - Login and get JWT token");
  });
}
