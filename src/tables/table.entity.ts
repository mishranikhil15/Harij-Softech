import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tables')
export class TableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  floorId: number;

  @Column()
  capacity: number;

  @Column({ default: 'VACANT' })
  status: string;

  @Column({ type: 'int', nullable: true })
  waiterId: number | null;
}
