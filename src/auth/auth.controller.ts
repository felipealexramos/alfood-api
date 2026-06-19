import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessToken, AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('api/v2/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Public endpoint (no guard): exchanges admin credentials for a JWT.
  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Autentica o admin e retorna um JWT',
    description:
      'Endpoint público. Valida { usuario, senha } contra o admin único ' +
      'e devolve o access_token a ser usado como Bearer nas rotas /api/v2.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido',
    type: AccessToken,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  login(@Body() dto: LoginDto): Promise<AccessToken> {
    return this.authService.login(dto);
  }
}
