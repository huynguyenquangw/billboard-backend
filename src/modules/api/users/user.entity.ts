import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/abstract.entity';
import { AuthType } from 'src/constants/auth-type';
import { RoleType } from 'src/constants/role-type';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Ward } from '../address/ward.entity';
import { Billboard } from '../billboards/billboard.entity';
import { UserInfoDto } from './dto/user-info.dto';

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ unique: false, nullable: false })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  address2: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: AuthType, default: AuthType.LOCAL })
  authType: AuthType;

  @Column({ nullable: true, default: null })
  authProviderId: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Ward)
  @JoinColumn()
  ward: Ward;

  @OneToMany(() => Billboard, (billboard) => billboard.user)
  billboards: Billboard[];

  toDto(): UserInfoDto {
    return new UserInfoDto(this);
  }
}
