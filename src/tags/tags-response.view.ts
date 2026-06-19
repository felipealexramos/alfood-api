import { ApiProperty } from '@nestjs/swagger';
import { Tag } from './tag.entity';

/** Wrapper shape consumed by the front-end: { tags: ITag[] }. */
export class TagsResponse {
  @ApiProperty({ type: [Tag], description: 'Lista de tags disponíveis' })
  tags!: Tag[];
}
