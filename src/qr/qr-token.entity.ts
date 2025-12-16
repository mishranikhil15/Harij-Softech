import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('qr_tokens')
export class QrTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  token: string;

  @Column()
  waiterId: number;

  @Column()
  expiresAt: Date;
}
