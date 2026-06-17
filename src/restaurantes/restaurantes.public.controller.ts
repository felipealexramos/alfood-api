import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Paginacao } from '../common/paginacao.interface';
import { RestaurantesService } from './restaurantes.service';

@Controller('api/v1/restaurantes')
export class RestaurantesPublicController {
  constructor(private readonly restaurantesService: RestaurantesService) {}

  @Get()
  paginate(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<Paginacao<unknown>> {
    return this.restaurantesService.paginate(page);
  }
}
