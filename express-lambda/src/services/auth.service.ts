import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { User } from "../models/user.model";
import { usersService } from "./users.service";

// Get JWT secret from environment variables or use default for development
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION_TIME || "1h";

class AuthService {
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
    // Create JWT payload
    const payload = { email: user.email, sub: user.id };

    // Return JWT token
    return {
      access_token: jwt.sign(payload, JWT_SECRET as Secret, { expiresIn: JWT_EXPIRATION } as SignOptions),
    };
  }

  /**
   * Register a new user and return JWT token
   */
  async register(email: string, password: string) {
    // Check if user already exists
    const existingUser = usersService.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const user = await usersService.create(email, password);

    // Return JWT token just like login
    return this.login(user);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

// Export as singleton
export const authService = new AuthService();
