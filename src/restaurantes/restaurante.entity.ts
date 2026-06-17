import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Prato } from '../pratos/prato.entity';

@Entity('restaurantes')
export class Restaurante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @OneToMany(() => Prato, (prato) => prato.restaurante, { cascade: ['remove'] })
  pratos: Prato[];
}
