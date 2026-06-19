import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Usuário admin', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  usuario: string;

  @ApiProperty({ description: 'Senha do admin', example: 'minha-senha' })
  @IsString()
  @IsNotEmpty()
  senha: string;
}
