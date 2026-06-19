import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

export class AccessToken {
  @ApiProperty({
    description: 'JWT de acesso para usar como Bearer token em /api/v2',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ usuario, senha }: LoginDto): Promise<AccessToken> {
    await this.validate(usuario, senha);
    const payload = { sub: 'admin', usuario };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  // Validates the single admin user against ADMIN_USERNAME / ADMIN_PASSWORD_HASH.
  // The error message is intentionally generic to avoid leaking which field failed.
  private async validate(usuario: string, senha: string): Promise<void> {
    const expectedUser = this.config.get<string>('ADMIN_USERNAME');
    const passwordHash = this.config.get<string>('ADMIN_PASSWORD_HASH');

    if (!expectedUser || !passwordHash) {
      throw new Error(
        'ADMIN_USERNAME and ADMIN_PASSWORD_HASH must be configured',
      );
    }

    const userMatches = usuario === expectedUser;
    const passwordMatches = await bcrypt.compare(senha, passwordHash);
    if (!userMatches || !passwordMatches) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }
}
