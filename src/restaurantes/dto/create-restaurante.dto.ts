import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRestauranteDto {
  @ApiProperty({
    description: 'Nome do restaurante',
    example: 'Cantina da Nona',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;
}
