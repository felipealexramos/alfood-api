import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AccessToken, AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('api/v2/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Public endpoint (no guard): exchanges admin credentials for a JWT.
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto): Promise<AccessToken> {
    return this.authService.login(dto);
  }
}
