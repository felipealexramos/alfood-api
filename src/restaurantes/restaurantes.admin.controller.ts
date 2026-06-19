import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { Restaurante } from './restaurante.entity';
import { RestaurantesService } from './restaurantes.service';

@UseGuards(JwtAuthGuard)
@Controller('api/v2/restaurantes')
export class RestaurantesAdminController {
  constructor(private readonly restaurantesService: RestaurantesService) {}

  @Get()
  findAll(): Promise<Restaurante[]> {
    return this.restaurantesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Restaurante> {
    return this.restaurantesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRestauranteDto): Promise<Restaurante> {
    return this.restaurantesService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRestauranteDto,
  ): Promise<Restaurante> {
    return this.restaurantesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.restaurantesService.remove(id);
  }
}
