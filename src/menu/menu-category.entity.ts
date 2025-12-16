import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('menu_categories')
export class MenuCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
