import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePratoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  // Arrives as a string in multipart/form-data; coerced to a number.
  @Type(() => Number)
  @IsInt()
  restaurante: number;
}
