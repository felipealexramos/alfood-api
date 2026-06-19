import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginacao } from '../common/paginacao.interface';
import { RestaurantePaginado } from './restaurante-paginado.view';
import { RestaurantesService } from './restaurantes.service';

@ApiTags('vitrine (público)')
@Controller('api/v1/restaurantes')
export class RestaurantesPublicController {
  constructor(private readonly restaurantesService: RestaurantesService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista restaurantes paginados (vitrine pública)',
    description:
      'Endpoint público. Retorna o envelope DRF { count, next, previous, results }.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Número da página (padrão 1)',
  })
  @ApiResponse({ status: 200, type: RestaurantePaginado })
  paginate(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<Paginacao<unknown>> {
    return this.restaurantesService.paginate(page);
  }
}
