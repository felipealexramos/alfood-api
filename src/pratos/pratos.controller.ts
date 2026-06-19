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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePratoDto } from './dto/create-prato.dto';
import { UpdatePratoDto } from './dto/update-prato.dto';
import { PratoView } from './prato.view';
import { PratosService } from './pratos.service';
import { pratoImageUpload } from './upload.config';

@ApiTags('pratos (admin)')
@ApiBearerAuth('jwt')
@ApiResponse({ status: 401, description: 'Token JWT ausente ou inválido' })
@UseGuards(JwtAuthGuard)
@Controller('api/v2/pratos')
export class PratosController {
  constructor(private readonly pratosService: PratosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os pratos' })
  @ApiResponse({ status: 200, type: [PratoView] })
  findAll(): Promise<PratoView[]> {
    return this.pratosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um prato por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, type: PratoView })
  @ApiResponse({ status: 404, description: 'Prato não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PratoView> {
    return this.pratosService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('imagem', pratoImageUpload))
  @ApiOperation({ summary: 'Cria um prato (com imagem opcional)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePratoDto })
  @ApiResponse({ status: 201, type: PratoView })
  create(
    @Body() dto: CreatePratoDto,
    @UploadedFile() imagem?: Express.Multer.File,
  ): Promise<PratoView> {
    return this.pratosService.create(dto, imagem?.filename);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('imagem', pratoImageUpload))
  @ApiOperation({
    summary: 'Atualiza um prato (substitui a imagem se enviada)',
  })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePratoDto })
  @ApiResponse({ status: 200, type: PratoView })
  @ApiResponse({ status: 404, description: 'Prato não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePratoDto,
    @UploadedFile() imagem?: Express.Multer.File,
  ): Promise<PratoView> {
    return this.pratosService.update(id, dto, imagem?.filename);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove um prato (apaga também a imagem)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 204, description: 'Prato removido' })
  @ApiResponse({ status: 404, description: 'Prato não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pratosService.remove(id);
  }
}
