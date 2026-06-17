import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurante } from '../restaurantes/restaurante.entity';

@Entity('pratos')
export class Prato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  descricao: string;

  // The tag is stored as a plain string (the chosen Tag.value), mirroring the
  // front-end contract where IPrato.tag is a string.
  @Column()
  tag: string;

  // Stored as the uploaded file name; exposed to clients as an absolute URL.
  @Column({ type: 'varchar', nullable: true })
  imagem: string | null;

  @ManyToOne(() => Restaurante, (restaurante) => restaurante.pratos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restauranteId' })
  restaurante: Restaurante;

  @Column()
  restauranteId: number;
}
