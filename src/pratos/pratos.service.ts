import { promises as fs } from 'fs';
import { join } from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePratoDto } from './dto/create-prato.dto';
import { UpdatePratoDto } from './dto/update-prato.dto';
import { Prato } from './prato.entity';
import { PratoView, serializePrato } from './prato.view';

@Injectable()
export class PratosService {
  constructor(
    @InjectRepository(Prato)
    private readonly pratosRepository: Repository<Prato>,
    private readonly config: ConfigService,
  ) {}

  async findAll(): Promise<PratoView[]> {
    const pratos = await this.pratosRepository.find({ order: { id: 'ASC' } });
    return pratos.map((prato) => this.toView(prato));
  }

  async findOne(id: number): Promise<PratoView> {
    return this.toView(await this.findEntity(id));
  }

  async create(dto: CreatePratoDto, imagem?: string): Promise<PratoView> {
    const prato = this.pratosRepository.create({
      nome: dto.nome,
      descricao: dto.descricao,
      tag: dto.tag,
      restauranteId: dto.restaurante,
      imagem: imagem ?? null,
    });
    const saved = await this.pratosRepository.save(prato);
    return this.toView(saved);
  }

  async update(
    id: number,
    dto: UpdatePratoDto,
    imagem?: string,
  ): Promise<PratoView> {
    const prato = await this.findEntity(id);

    if (dto.nome !== undefined) prato.nome = dto.nome;
    if (dto.descricao !== undefined) prato.descricao = dto.descricao;
    if (dto.tag !== undefined) prato.tag = dto.tag;
    if (dto.restaurante !== undefined) prato.restauranteId = dto.restaurante;

    if (imagem) {
      await this.removeImageFile(prato.imagem);
      prato.imagem = imagem;
    }

    const saved = await this.pratosRepository.save(prato);
    return this.toView(saved);
  }

  async remove(id: number): Promise<void> {
    const prato = await this.findEntity(id);
    await this.pratosRepository.remove(prato);
    await this.removeImageFile(prato.imagem);
  }

  private async findEntity(id: number): Promise<Prato> {
    const prato = await this.pratosRepository.findOne({ where: { id } });
    if (!prato) {
      throw new NotFoundException(`Prato ${id} não encontrado.`);
    }
    return prato;
  }

  private toView(prato: Prato): PratoView {
    const appUrl = this.config.get<string>('APP_URL', 'http://localhost:8000');
    return serializePrato(prato, appUrl);
  }

  private async removeImageFile(filename: string | null): Promise<void> {
    if (!filename) return;
    await fs.rm(join(process.cwd(), 'uploads', filename), { force: true });
  }
}
