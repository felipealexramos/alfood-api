import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paginacao } from '../common/paginacao.interface';
import { serializePrato } from '../pratos/prato.view';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { Restaurante } from './restaurante.entity';

const DEFAULT_PAGE_SIZE = 10;

interface RestauranteView {
  id: number;
  nome: string;
  pratos: ReturnType<typeof serializePrato>[];
}

@Injectable()
export class RestaurantesService {
  constructor(
    @InjectRepository(Restaurante)
    private readonly restaurantesRepository: Repository<Restaurante>,
    private readonly config: ConfigService,
  ) {}

  /** v2 admin listing — plain array. */
  findAll(): Promise<Restaurante[]> {
    return this.restaurantesRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Restaurante> {
    const restaurante = await this.restaurantesRepository.findOne({
      where: { id },
    });
    if (!restaurante) {
      throw new NotFoundException(`Restaurante ${id} não encontrado.`);
    }
    return restaurante;
  }

  create(dto: CreateRestauranteDto): Promise<Restaurante> {
    const restaurante = this.restaurantesRepository.create(dto);
    return this.restaurantesRepository.save(restaurante);
  }

  async update(id: number, dto: UpdateRestauranteDto): Promise<Restaurante> {
    const restaurante = await this.findOne(id);
    Object.assign(restaurante, dto);
    return this.restaurantesRepository.save(restaurante);
  }

  async remove(id: number): Promise<void> {
    const restaurante = await this.findOne(id);
    await this.restaurantesRepository.remove(restaurante);
  }

  /** v1 public vitrine — paginated envelope with nested pratos. */
  async paginate(page: number): Promise<Paginacao<RestauranteView>> {
    const currentPage = page > 0 ? page : 1;
    const [restaurantes, count] =
      await this.restaurantesRepository.findAndCount({
        relations: { pratos: true },
        order: { id: 'ASC' },
        take: DEFAULT_PAGE_SIZE,
        skip: (currentPage - 1) * DEFAULT_PAGE_SIZE,
      });

    const appUrl = this.config.get<string>('APP_URL', 'http://localhost:8000');
    const results: RestauranteView[] = restaurantes.map((restaurante) => ({
      id: restaurante.id,
      nome: restaurante.nome,
      pratos: (restaurante.pratos ?? []).map((prato) =>
        serializePrato(prato, appUrl),
      ),
    }));

    const lastPage = Math.max(1, Math.ceil(count / DEFAULT_PAGE_SIZE));
    const base = `${appUrl.replace(/\/$/, '')}/api/v1/restaurantes/`;
    const pageUrl = (p: number) => (p === 1 ? base : `${base}?page=${p}`);

    return {
      count,
      next: currentPage < lastPage ? pageUrl(currentPage + 1) : null,
      previous: currentPage > 1 ? pageUrl(currentPage - 1) : null,
      results,
    };
  }
}
