import { ApiProperty } from '@nestjs/swagger';
import { Prato } from './prato.entity';

export class PratoView {
  @ApiProperty({ description: 'ID do prato', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome do prato', example: 'Lasanha à Bolonhesa' })
  nome: string;

  @ApiProperty({
    description: 'Descrição do prato',
    example: 'Massa fresca com molho bolonhesa e queijo gratinado',
  })
  descricao: string;

  @ApiProperty({ description: 'Valor da tag', example: 'Italiana' })
  tag: string;

  @ApiProperty({
    description: 'URL absoluta da imagem do prato (ou null)',
    example: 'http://localhost:8000/media/abc123.jpg',
    nullable: true,
    type: String,
  })
  imagem: string | null;

  @ApiProperty({ description: 'ID do restaurante dono do prato', example: 1 })
  restaurante: number;
}

/**
 * Maps a Prato entity to the shape the front-end consumes (IPrato):
 * the stored image file name becomes an absolute URL and the relation is
 * flattened to the restaurante id.
 */
export function serializePrato(prato: Prato, appUrl: string): PratoView {
  return {
    id: prato.id,
    nome: prato.nome,
    descricao: prato.descricao,
    tag: prato.tag,
    imagem: prato.imagem
      ? `${appUrl.replace(/\/$/, '')}/media/${prato.imagem}`
      : null,
    restaurante: prato.restauranteId,
  };
}
