import {
  Column,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import Breed from './breed.entity';

@Entity({ name: 'cats' })
export default class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character varying', { length: 255 })
  name: string;

  @Column('int')
  age: number;

  @ManyToOne(() => Breed, breed => breed.cats)
  breed: Breed;

  @ManyToOne(() => User, user => user.cats)
  owner: User;
}
