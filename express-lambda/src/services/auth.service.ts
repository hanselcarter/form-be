import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { User } from "../models/user.model";
import { usersService } from "./users.service";

// Get JWT secret from environment variables or use default for development
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION_TIME || "1h";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret-key";
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || "7d";

// Store for refresh tokens (in a real app, this would be in a database)
interface RefreshTokenStore {
  [userId: number]: string;
}

class AuthService {
  // In-memory store for refresh tokens
  private refreshTokens: RefreshTokenStore = {};

  /**
   * Validate user credentials
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    return usersService.validateUser(email, password);
  }

  /**
   * Generate JWT token for authenticated user
   */
  login(user: User) {
    const payload = { email: user.email, sub: user.id };
    
    // Generate access token
    const accessToken = jwt.sign(
      payload,
      JWT_SECRET as Secret,
      { expiresIn: JWT_EXPIRATION } as SignOptions
    );
    
    // Generate refresh token
    const refreshToken = jwt.sign(
      { sub: user.id },
      REFRESH_TOKEN_SECRET as Secret,
      { expiresIn: REFRESH_TOKEN_EXPIRATION } as SignOptions
    );
    
    // Store the refresh token
    this.refreshTokens[user.id] = refreshToken;
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * Register a new user and return JWT token
   */
  async register(email: string, password: string) {
    const existingUser = usersService.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const user = await usersService.create(email, password);

    return this.login(user);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET as Secret);
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET as Secret);
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Refresh access token using refresh token
   */
  refreshToken(refreshToken: string) {
    // Verify the refresh token
    const decoded = this.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error("Invalid refresh token");
    }
    
    const userId = decoded.sub;
    
    // Check if the refresh token matches the stored one
    if (this.refreshTokens[userId] !== refreshToken) {
      throw new Error("Refresh token has been revoked");
    }
    
    // Find the user
    const user = usersService.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Generate a new access token
    const payload = { email: user.email, sub: user.id };
    const accessToken = jwt.sign(
      payload,
      JWT_SECRET as Secret,
      { expiresIn: JWT_EXPIRATION } as SignOptions
    );
    
    return {
      access_token: accessToken,
    };
  }
}

export const authService = new AuthService();
