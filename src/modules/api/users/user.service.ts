import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly repository: Repository<UserEntity>;

  public getUserById(id: number): Promise<UserEntity> {
    return this.repository.findOneBy({ id: id });
  }

  public createUser(body: CreateUserDto): Promise<UserEntity> {
    const user: UserEntity = new UserEntity();

    user.name = body.name;
    user.email = body.email;

    return this.repository.save(user);
  }

  // async findOrCreate(profile): Promise<User> {
  //   const user = await this.userModel
  //     .findOne({ 'facebook.id': profile.id })
  //     .exec();
  //   if (user) {
  //     return user;
  //   }
  //   const createdUser = new this.userModel({
  //     email: profile.emails[0].value,
  //     firstName: profile.name.givenName,
  //     lastName: profile.name.familyName,
  //     Facebook: {
  //       id: profile.id,
  //       avatar: profile.photos[0].value,
  //     },
  //   });
  //   return createdUser.save();
  // }
}
