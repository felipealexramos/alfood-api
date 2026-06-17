import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prato } from './prato.entity';
import { PratosController } from './pratos.controller';
import { PratosService } from './pratos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prato])],
  controllers: [PratosController],
  providers: [PratosService],
})
export class PratosModule {}
