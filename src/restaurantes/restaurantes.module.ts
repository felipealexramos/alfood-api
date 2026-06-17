import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurante } from './restaurante.entity';
import { RestaurantesAdminController } from './restaurantes.admin.controller';
import { RestaurantesPublicController } from './restaurantes.public.controller';
import { RestaurantesService } from './restaurantes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurante])],
  controllers: [RestaurantesAdminController, RestaurantesPublicController],
  providers: [RestaurantesService],
  exports: [RestaurantesService],
})
export class RestaurantesModule {}
