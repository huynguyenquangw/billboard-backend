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

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  address2: string;

  @Column({ name: 'company_name', nullable: true })
  companyName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: AuthType, default: AuthType.LOCAL })
  authType: AuthType;

  @Column({ nullable: true, default: null })
  authProviderId: string;

  @Column({
    // select: false,
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
  })
  role: RoleType;

  @DeleteDateColumn({
    select: false,
    type: 'timestamp without time zone',
    name: 'deleted_at',
  })
  deletedAt: Date;

  @ManyToOne(() => Ward)
  @JoinColumn({ name: 'ward_id' })
  ward: Ward;

  @OneToMany(() => Billboard, (billboard) => billboard.owner)
  billboards: Billboard[];

  toDto(): UserInfoDto {
    return new UserInfoDto(this);
  }
}
