import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../users/user.entity';

// Define request with user property
interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser) {
    // The user has been validated by the LocalAuthGuard
    // and is available in req.user
    return this.authService.login(req.user);
  }

  // Example of a protected route that requires JWT authentication
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    // req.user comes from the JWT validation
    return req.user;
  }
}
