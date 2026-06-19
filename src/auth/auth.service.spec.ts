import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const ADMIN_USERNAME = 'admin';
  const PASSWORD = 's3nha-secreta';
  const PASSWORD_HASH = bcrypt.hashSync(PASSWORD, 10);

  let service: AuthService;
  let jwtService: { signAsync: jest.Mock };

  beforeEach(() => {
    const config = {
      get: (key: string): string | undefined =>
        ({
          ADMIN_USERNAME,
          ADMIN_PASSWORD_HASH: PASSWORD_HASH,
        })[key],
    } as unknown as ConfigService;

    jwtService = { signAsync: jest.fn().mockResolvedValue('signed.jwt.token') };

    service = new AuthService(config, jwtService as unknown as JwtService);
  });

  it('returns an access_token for valid credentials', async () => {
    const result = await service.login({
      usuario: ADMIN_USERNAME,
      senha: PASSWORD,
    });

    expect(result).toEqual({ access_token: 'signed.jwt.token' });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 'admin',
      usuario: ADMIN_USERNAME,
    });
  });

  it('rejects an unknown username', async () => {
    await expect(
      service.login({ usuario: 'intruso', senha: PASSWORD }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('rejects a wrong password', async () => {
    await expect(
      service.login({ usuario: ADMIN_USERNAME, senha: 'errada' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
