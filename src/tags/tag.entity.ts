import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tags')
export class Tag {
  @ApiProperty({ description: 'ID da tag', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Valor da tag', example: 'Italiana' })
  @Column({ unique: true })
  value: string;
}
