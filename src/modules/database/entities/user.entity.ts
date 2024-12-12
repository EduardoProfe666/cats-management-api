import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import RefreshToken from './refresh-token.entity';
import { Role } from '../../../common/decorators/roles.decorator';
import Cat from './cat.entity';

@Entity({ name: 'users' })
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character varying', { length: 255 })
  name: string;

  @Column('character varying', { length: 255 })
  lastnames: string;

  @Column('character varying', { length: 255 })
  username: string;

  @Column('character varying', { length: 255 })
  @Index({ unique: true })
  email: string;

  @Column('character varying', { length: 255 })
  phoneNumber: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @Column('boolean')
  isActive: boolean;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  refreshToken?: RefreshToken;

  @OneToMany(() => Cat, (cat) => cat.owner)
  cats: Cat[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compareSync(password, this.password);
  }
}
