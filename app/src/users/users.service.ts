import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

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

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = this.findByEmail(email);

    // If user exists and password matches the hash
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }
}
