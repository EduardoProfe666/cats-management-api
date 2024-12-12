import {
  Column,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Cat from './cat.entity';

@Entity({ name: 'breeds' })
export default class Breed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character varying', { length: 255 })
  name: string;

  @Column('boolean')
  isActive: boolean;

  @OneToMany(() => Cat, (cat) => cat.breed)
  cats: Cat[];

}
