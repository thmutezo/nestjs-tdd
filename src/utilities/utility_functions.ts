import { HttpException, HttpStatus } from '@nestjs/common';
import { ObjectID } from 'mongodb';
import { User } from './../users/entities/user.entity';

const createObjectID = (id: string): ObjectID => {
  let userId: ObjectID;
  try {
    userId = new ObjectID(id);
  } catch (e) {
    throw new HttpException('Incorrect Id', HttpStatus.BAD_REQUEST);
  }
  return userId;
};

const removePassword = (user: User): Partial<User> => {
  const { password, ...returnedUser } = user;
  return returnedUser;
};

export { createObjectID, removePassword };
