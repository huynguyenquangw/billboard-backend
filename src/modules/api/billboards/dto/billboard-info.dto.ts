import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
} from 'class-validator';
import { AbstractDto } from 'src/common/dtos/abstract.dto';
import { StatusType } from 'src/constants';
import { Ward } from '../../address/ward.entity';
import { User } from '../../users/user.entity';
import { Billboard } from '../billboard.entity';
import { PreviousClient } from '../previousClients.entity';

export class BillboardInfoDto extends AbstractDto {
  @ApiProperty()
  readonly owner: User;

  @ApiProperty()
  readonly ward: Ward;

  @IsArray()
  readonly previousClients: PreviousClient[];

  @IsString()
  readonly address: string;

  @IsString()
  readonly address2: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly status: StatusType;

  @IsArray()
  readonly pictures: object[];

  @IsString()
  readonly video: string;

  @IsNumber()
  readonly size_x: number;

  @IsNumber()
  readonly size_y: number;

  @IsNumber()
  readonly circulation: number;

  @IsNumber()
  readonly rentalPrice: number;

  @IsString()
  readonly rentalDuration: string;

  @IsString()
  readonly description: string;

  @IsDate()
  readonly approvedAt: Date;

  @IsLatitude()
  readonly lat: number;

  @IsLongitude()
  readonly long: number;

  constructor(billboard: Billboard) {
    super(billboard);
    this.address = billboard.address;
    this.address2 = billboard.address2;
    this.name = billboard.name;
    this.status = billboard.status;
    this.pictures = billboard.pictures;
    this.video = billboard.video;
    this.size_x = billboard.size_x;
    this.size_y = billboard.size_y;
    this.circulation = billboard.circulation;
    this.previousClients = billboard.previousClients;
    this.rentalPrice = billboard.rentalPrice;
    this.rentalDuration = billboard.rentalDuration;
    this.description = billboard.description;
    this.owner = billboard.owner;
    this.ward = billboard.ward;
    this.approvedAt = billboard.approvedAt;
    this.lat = billboard.lat;
    this.long = billboard.long;
  }
}
