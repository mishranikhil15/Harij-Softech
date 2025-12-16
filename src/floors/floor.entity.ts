import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('floors')
export class FloorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
