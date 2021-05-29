import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongoClient, ObjectID } from 'mongodb';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from './../database/database.service';

dotenv.config();

describe('UsersService', () => {
  let service: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [UsersService, DatabaseService],
      exports: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });
  afterAll(async () => {
    try {
      const client = await MongoClient.connect(
        process.env.LOCAL_TEST_DATABASE_CONNECTION,
        {
          useUnifiedTopology: true,
        },
      );
      await client
        .db(process.env.TEST_DATABASE_NAME)
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
    } catch (error) {
      throw error;
    }
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should return list of users', async () => {
    const users = await service.findAll();
    expect(users).not.toHaveLength(0);
  });
});
