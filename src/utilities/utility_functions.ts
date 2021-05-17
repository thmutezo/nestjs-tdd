import { HttpException, HttpStatus } from '@nestjs/common';
import { ObjectID } from 'mongodb';

const createObjectID = (id: string): ObjectID => {
  let userId: ObjectID;
  try {
    userId = new ObjectID(id);
  } catch (e) {
    throw new HttpException('Incorrect Id', HttpStatus.BAD_REQUEST);
  }
  return userId;
};

export { createObjectID };
