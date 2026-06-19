import { ApiProperty } from '@nestjs/swagger';
import { Restaurante } from './restaurante.entity';

/** DRF-style pagination envelope returned by the public vitrine endpoint. */
export class RestaurantePaginado {
  @ApiProperty({ description: 'Total de restaurantes', example: 42 })
  count!: number;

  @ApiProperty({
    description: 'URL da próxima página (ou null)',
    example: 'http://localhost:8000/api/v1/restaurantes?page=2',
    nullable: true,
    type: String,
  })
  next!: string | null;

  @ApiProperty({
    description: 'URL da página anterior (ou null)',
    example: null,
    nullable: true,
    type: String,
  })
  previous!: string | null;

  @ApiProperty({
    type: [Restaurante],
    description: 'Restaurantes desta página',
  })
  results!: Restaurante[];
}
