import { ApiProperty } from '@nestjs/swagger';
import { PratoView } from '../pratos/prato.view';

/**
 * Shape of each vitrine result: not the raw Restaurante entity, but a flattened
 * view with the nested, serialized dishes (see RestaurantesService.paginate).
 */
export class RestauranteVitrine {
  @ApiProperty({ description: 'ID do restaurante', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Nome do restaurante',
    example: 'Cantina da Nona',
  })
  nome: string;

  @ApiProperty({ type: [PratoView], description: 'Pratos do restaurante' })
  pratos: PratoView[];
}

/** DRF-style pagination envelope returned by the public vitrine endpoint. */
export class RestaurantePaginado {
  @ApiProperty({ description: 'Total de restaurantes', example: 42 })
  count: number;

  @ApiProperty({
    description: 'URL da próxima página (ou null)',
    example: 'http://localhost:8000/api/v1/restaurantes?page=2',
    nullable: true,
    type: String,
  })
  next: string | null;

  @ApiProperty({
    description: 'URL da página anterior (ou null)',
    example: null,
    nullable: true,
    type: String,
  })
  previous: string | null;

  @ApiProperty({
    type: [RestauranteVitrine],
    description: 'Restaurantes desta página',
  })
  results: RestauranteVitrine[];
}
