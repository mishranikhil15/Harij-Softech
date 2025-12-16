import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('waiters')
export class WaiterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
