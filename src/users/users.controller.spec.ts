import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { Db, MongoClient, ObjectID } from 'mongodb';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

const newUserDTO: CreateUserDto = {
  user_info: {
    firstname: 'Kudakwashe',
    initials: 'J P C',
    surname: 'Murungu',
  },
  username: 'kuda',
  email: 'kudajpc@gmail.com',
  password: 'kuda123',
  createdDate: Date.now().toString(),
  admin: true,
};

const existingUserDto = {
  _id: new ObjectID('608c80e4e88ebb34f4dc93f3'),
  user_info: { firstname: 'Tafadzwa', initials: 'H', surname: 'Mutezo' },
  username: 'happy',
  email: 'fidwa16@gmail.com',
  password: 'happy123',
  createdDate: '1619820767206',
  admin: true,
};

const existingUsername = {
  user_info: { firstname: 'Tatenda', initials: 'H', surname: 'Chipuriro' },
  username: 'happy',
  email: 'fidwa@gmail.com',
  password: 'happy123',
  createdDate: Date.now().toString(),
  admin: false,
};

const newUpdateUserDTO: CreateUserDto = {
  user_info: {
    firstname: 'Prayer',
    initials: 'D',
    surname: 'Makono',
  },
  username: 'prayer',
  email: 'macdee@gmail.com',
  password: 'prayer123',
  createdDate: Date.now().toString(),
  admin: false,
};

dotenv.config();
describe('UsersController', () => {
  let controller: UsersController;
  let client: MongoClient;
  let database: Db | Promise<Db>;
  let updatedUserId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider('DATABASE_CONNECTION')
      .useFactory({
        factory: async (): Promise<Db> => {
          try {
            client = await MongoClient.connect(
              process.env.LOCAL_TEST_DATABASE_CONNECTION,
              {
                useUnifiedTopology: true,
              },
            );
            database = client.db(process.env.TEST_DATABASE_NAME);
            return database;
          } catch (e) {
            throw e;
          }
        },
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });
  afterAll(async () => {
    await client
      .db('amnesty-test')
      .collection('users')
      .deleteMany({
        _id: {
          $nin: [
            new ObjectID('608c80e4e88ebb34f4dc93f3'),
            new ObjectID('608c912255d61d34d8d8adc9'),
          ],
        },
      });
    await client.close();
  });

  describe('users controller', () => {
    it('should be defined', async () => {
      expect(controller).toBeDefined();
    });
  });

  describe('users/create', () => {
    it('should create and return new user', async () => {
      const createdUser = await controller.create(newUserDTO);
      expect(createdUser).toBeTruthy();
      expect(createdUser).toStrictEqual({
        _id: expect.any(ObjectID),
        ...newUserDTO,
      });
    });
    it('should return error when creating existing user', async () => {
      expect.assertions(1);
      try {
        await controller.create(existingUserDto);
      } catch (e) {
        expect(e).toEqual(
          new HttpException('User already exists', HttpStatus.BAD_REQUEST),
        );
      }
    });
    it('should return error when creating user with same username', async () => {
      expect.assertions(1);
      try {
        await controller.create(existingUsername);
      } catch (e) {
        expect(e).toEqual(
          new HttpException('Username already exists', HttpStatus.BAD_REQUEST),
        );
      }
    });
  });

  describe('users/findAll', () => {
    it('should return all users', async () => {
      const users = await controller.findAll();
      expect(users).toBeTruthy();
      expect(users).not.toHaveLength(0);
    });
  });

  describe('users/findOne', () => {
    it('should return user by ID', async () => {
      const user = await controller.findOne('608c80e4e88ebb34f4dc93f3');
      expect(user).not.toHaveLength(0);
      expect(user[0]).toBeTruthy();
      expect(user[0]).toEqual(existingUserDto);
    });
    it('should return error when no user is found', async () => {
      expect.assertions(1);
      try {
        await controller.findOne('608c80e4e88ebb34f4dc93f1');
      } catch (e) {
        expect(e).toEqual(
          new HttpException('No user found', HttpStatus.NOT_FOUND),
        );
      }
    });
    it('should return error when ID is wrong', async () => {
      expect.assertions(1);
      try {
        await controller.findOne('608c80e4ed');
      } catch (e) {
        expect(e).toEqual(
          new HttpException('Incorrect Id', HttpStatus.BAD_REQUEST),
        );
      }
    });
  });

  describe('users/update', () => {
    it('should update user with id', async () => {
      const user = await controller.create(newUpdateUserDTO);
      const userId = user._id.toHexString();
      updatedUserId = userId;
      const updatedUser = await controller.update(userId, {
        email: 'prayer@gmail.com',
      });
      expect(updatedUser[0]).toBeTruthy();
      expect(updatedUser[0]).toStrictEqual({
        ...user,
        email: 'prayer@gmail.com',
      });
    });
    it('should return error if no user to update is found', async () => {
      expect.assertions(1);
      try {
        await controller.update('6094963c6d28602088a3dfaf', {
          email: 'prayer@gmail.com',
        });
      } catch (e) {
        expect(e).toEqual(
          new HttpException('No User updated', HttpStatus.NOT_FOUND),
        );
      }
    });
    it('should return error when ID is wrong', async () => {
      expect.assertions(1);
      try {
        await controller.update('608c80e4ed', {
          email: 'prayer@gmail.com',
        });
      } catch (e) {
        expect(e).toEqual(
          new HttpException('Incorrect Id', HttpStatus.BAD_REQUEST),
        );
      }
    });
    it('should return error if no update body is provided', async () => {
      expect.assertions(1);
      try {
        await controller.update(updatedUserId, {});
      } catch (e) {
        expect(e).toEqual(
          new HttpException('No update body provided', HttpStatus.BAD_REQUEST),
        );
      }
    });
  });

  describe('users/remove', () => {
    it('should remove user by id', async () => {
      const removedUser = await controller.remove(updatedUserId);
      expect(removedUser).toBeTruthy();
      expect(removedUser).toBe(1);
    });

    it('should return error when ID is wrong', async () => {
      expect.assertions(1);
      try {
        await controller.remove('608c80e4ed');
      } catch (e) {
        expect(e).toEqual(
          new HttpException('Incorrect Id', HttpStatus.BAD_REQUEST),
        );
      }
    });

    it('should return error if no user to remove is found', async () => {
      expect.assertions(1);
      try {
        await controller.remove('6094963c6d28602088a3dfaf');
      } catch (e) {
        expect(e).toEqual(
          new HttpException('No user with Id found', HttpStatus.NOT_FOUND),
        );
      }
    });
  });
});
