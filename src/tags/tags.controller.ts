import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Tag } from './tag.entity';
import { TagsResponse } from './tags-response.view';
import { TagsService } from './tags.service';

@ApiTags('tags (admin)')
@ApiBearerAuth('jwt')
@ApiResponse({ status: 401, description: 'Token JWT ausente ou inválido' })
@UseGuards(JwtAuthGuard)
@Controller('api/v2/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // The front-end expects the wrapper shape { tags: ITag[] }.
  @Get()
  @ApiOperation({ summary: 'Lista as tags disponíveis' })
  @ApiResponse({ status: 200, type: TagsResponse })
  async findAll(): Promise<{ tags: Tag[] }> {
    const tags = await this.tagsService.findAll();
    return { tags };
  }
}
