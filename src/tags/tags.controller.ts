import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Tag } from './tag.entity';
import { TagsService } from './tags.service';

@UseGuards(JwtAuthGuard)
@Controller('api/v2/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // The front-end expects the wrapper shape { tags: ITag[] }.
  @Get()
  async findAll(): Promise<{ tags: Tag[] }> {
    const tags = await this.tagsService.findAll();
    return { tags };
  }
}
