import { DistrictEntity } from 'src/api/address/district.entity';
import { UserEntity } from 'src/api/users/users.entity';
import {Column, Entity, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';

export enum Status{
    DRAFT = 'draft',
    PENDING = 'pending',
    APPROVAL = 'approval',
    INVALID = 'invalid',
}

@Entity('billboard')
export class BillboardEnity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> UserEntity, (user) =>user.billboard)
    user: UserEntity;
    
    @ManyToOne(()=> DistrictEntity, (district) =>district.billboard )
    district: DistrictEntity;

    @Column()
    address: string;

    @Column()
    area? :string;

    @Column()
    name: string;

    @Column('simple-array')     //Array contains an id and url link
    picture : string[];

    @Column('simple-array')     //Array contains an id and url link
    video? : string[];

    @Column()
    size_x: number;

    @Column()
    size_y: number;

    @Column()
    circulation: number;

    @Column()
    previousClient?: string;

    @Column()
    rentalPrice: number;

    @Column()
    rentalDuration: number;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.DRAFT,
    })
    status: Status

    @Column('bool')
    isRented: boolean

    @Column('bool')
    isActive: boolean

}