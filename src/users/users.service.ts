import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Db } from 'mongodb';
import { User } from './entities/user.entity';
import { createObjectID, removePassword } from '../utilities/utility_functions';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from './../database/database.service';

@Injectable()
export class UsersService {
  constructor(@Inject(DatabaseService) private db: Db) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { username, email } = createUserDto;
    const { firstname, initials, surname } = createUserDto.user_info;
    //check if the user already exists and throw error
    const existingUser = await this.db
      .collection('users')
      .aggregate([
        {
          $match: {
            'user_info.firstname': firstname,
            'user_info.initials': initials,
            'user_info.surname': surname,
            email: email,
            username: username,
          },
        },
      ])
      .toArray();
    if (existingUser.length > 0) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    //check if username already exists and throw error
    const existingUsername = await this.db
      .collection('users')
      .aggregate([
        {
          $match: {
            username: username,
          },
        },
      ])
      .toArray();
    if (existingUsername.length > 0) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const response = await this.db
      .collection('users')
      .insertOne({ ...createUserDto, password: hash });
    return removePassword(response.ops[0]);
  }

  async findAll(): Promise<any> {
    const users = await this.db.collection('users').find().toArray();
    const newUsers = users.map((user) => removePassword(user));
    return newUsers;
  }

  async findById(id: string): Promise<any> {
    //check if id is correct ObjectId and create Object(id)
    const userId = createObjectID(id);
    const user = await this.db
      .collection('users')
      .aggregate([
        {
          $match: {
            _id: userId,
          },
        },
      ])
      .toArray();
    // throw error if no user found
    if (user.length === 0) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
    return removePassword(user[0]);
  }

  async findByUsername(username: string): Promise<any> {
    const user = await this.db
      .collection('users')
      .aggregate([
        {
          $match: {
            username: username,
          },
        },
      ])
      .toArray();
    return user[0];
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const userId = createObjectID(id);
    if (
      Object.keys(updateUserDto).length === 0 ||
      updateUserDto === null ||
      updateUserDto === undefined
    ) {
      throw new HttpException(
        'No update body provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (Object.prototype.hasOwnProperty.call(updateUserDto, 'password')) {
      const hash = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hash;
    }
    const { result } = await this.db.collection('users').updateOne(
      {
        _id: userId,
      },
      {
        $set: { ...updateUserDto },
      },
    );
    //validate if any updates are done
    if (result.nModified !== 1) {
      throw new HttpException('No User updated', HttpStatus.NOT_FOUND);
    }
    const updatedUser = await this.findById(id);
    return updatedUser;
  }

  async remove(id: string): Promise<any> {
    const userId = createObjectID(id);
    const { deletedCount } = await this.db
      .collection('users')
      .deleteOne({ _id: userId });
    if (deletedCount === 0) {
      throw new HttpException('No user with Id found', HttpStatus.NOT_FOUND);
    }
    return deletedCount;
  }
}
