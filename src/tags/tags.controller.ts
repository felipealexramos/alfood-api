import { Controller, Get } from '@nestjs/common';
import { Tag } from './tag.entity';
import { TagsService } from './tags.service';

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
