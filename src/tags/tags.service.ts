import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

const DEFAULT_TAGS = [
  'Italiana',
  'Japonesa',
  'Brasileira',
  'Mexicana',
  'Árabe',
  'Vegetariana',
  'Sobremesa',
];

@Injectable()
export class TagsService implements OnModuleInit {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDefaults();
  }

  findAll(): Promise<Tag[]> {
    return this.tagsRepository.find({ order: { id: 'ASC' } });
  }

  private async seedDefaults(): Promise<void> {
    const existing = await this.tagsRepository.count();
    if (existing > 0) {
      return;
    }
    const tags = DEFAULT_TAGS.map((value) =>
      this.tagsRepository.create({ value }),
    );
    await this.tagsRepository.save(tags);
  }
}
