import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  /**
   * Find a user by email
   */
  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  /**
   * Create a new user
   */
  async create(email: string, password: string): Promise<User> {
    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with incremented ID
    const user: User = {
      id: this.idCounter++,
      email,
      password: hashedPassword,
    };

    // Add to our in-memory array
    this.users.push(user);

    return user;
  }

  /**
   * Validate user credentials
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = this.findByEmail(email);

    // If user exists and password matches the hash
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }
}

// Export as singleton
export const usersService = new UsersService();
