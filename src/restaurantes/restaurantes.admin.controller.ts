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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { Restaurante } from './restaurante.entity';
import { RestaurantesService } from './restaurantes.service';

@ApiTags('restaurantes (admin)')
@ApiBearerAuth('jwt')
@ApiResponse({ status: 401, description: 'Token JWT ausente ou inválido' })
@UseGuards(JwtAuthGuard)
@Controller('api/v2/restaurantes')
export class RestaurantesAdminController {
  constructor(private readonly restaurantesService: RestaurantesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os restaurantes' })
  @ApiResponse({ status: 200, type: [Restaurante] })
  findAll(): Promise<Restaurante[]> {
    return this.restaurantesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um restaurante por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, type: Restaurante })
  @ApiResponse({ status: 404, description: 'Restaurante não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Restaurante> {
    return this.restaurantesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um restaurante' })
  @ApiResponse({ status: 201, type: Restaurante })
  create(@Body() dto: CreateRestauranteDto): Promise<Restaurante> {
    return this.restaurantesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um restaurante' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, type: Restaurante })
  @ApiResponse({ status: 404, description: 'Restaurante não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRestauranteDto,
  ): Promise<Restaurante> {
    return this.restaurantesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove um restaurante (cascateia os pratos)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 204, description: 'Restaurante removido' })
  @ApiResponse({ status: 404, description: 'Restaurante não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.restaurantesService.remove(id);
  }
}
