import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Prato } from '../pratos/prato.entity';

@Entity('restaurantes')
export class Restaurante {
  @ApiProperty({ description: 'ID do restaurante', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nome do restaurante',
    example: 'Cantina da Nona',
  })
  @Column()
  nome: string;

  @OneToMany(() => Prato, (prato) => prato.restaurante, { cascade: ['remove'] })
  pratos: Prato[];
}
