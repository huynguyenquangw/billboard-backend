import { AbstractEntity } from 'src/common/abstract.entity';
import { AuthType } from 'src/constants/auth-type';
import { RoleType } from 'src/constants/role-type';
import { Column, Entity } from 'typeorm';
import { UserDto } from './dto/UserDto';

@Entity()
export class UserEntity extends AbstractEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  address2: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: AuthType, default: AuthType.LOCAL })
  authType: string;

  @Column({ nullable: true, default: null })
  authProviderId: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  // @OneToMany(() => BillboardEnity, (billboard) => billboard.user)
  // billboard: BillboardEnity[];
  toDto(): UserDto {
    return new UserDto(this);
  }
}
