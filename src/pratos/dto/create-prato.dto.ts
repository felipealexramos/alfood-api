import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePratoDto {
  @ApiProperty({ description: 'Nome do prato', example: 'Lasanha à Bolonhesa' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: 'Descrição do prato',
    example: 'Massa fresca com molho bolonhesa e queijo gratinado',
  })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({
    description: 'Valor da tag associada ao prato',
    example: 'Italiana',
  })
  @IsString()
  @IsNotEmpty()
  tag: string;

  @ApiProperty({
    description: 'ID do restaurante dono do prato',
    example: 1,
    type: Number,
  })
  // Arrives as a string in multipart/form-data; coerced to a number.
  @Type(() => Number)
  @IsInt()
  restaurante: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Arquivo de imagem do prato (até 5MB, JPEG/PNG/WebP)',
  })
  imagem?: Express.Multer.File;
}
