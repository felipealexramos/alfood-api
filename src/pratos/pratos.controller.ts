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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePratoDto } from './dto/create-prato.dto';
import { UpdatePratoDto } from './dto/update-prato.dto';
import { PratoView } from './prato.view';
import { PratosService } from './pratos.service';
import { pratoImageUpload } from './upload.config';

@UseGuards(JwtAuthGuard)
@Controller('api/v2/pratos')
export class PratosController {
  constructor(private readonly pratosService: PratosService) {}

  @Get()
  findAll(): Promise<PratoView[]> {
    return this.pratosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PratoView> {
    return this.pratosService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('imagem', pratoImageUpload))
  create(
    @Body() dto: CreatePratoDto,
    @UploadedFile() imagem?: Express.Multer.File,
  ): Promise<PratoView> {
    return this.pratosService.create(dto, imagem?.filename);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('imagem', pratoImageUpload))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePratoDto,
    @UploadedFile() imagem?: Express.Multer.File,
  ): Promise<PratoView> {
    return this.pratosService.update(id, dto, imagem?.filename);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pratosService.remove(id);
  }
}
