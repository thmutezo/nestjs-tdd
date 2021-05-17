import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongoClient, Db, ObjectID } from 'mongodb';
import { DatabaseModule } from '../database/database.module';

dotenv.config();

describe('UsersService', () => {
  let service: UsersService;
  let client: MongoClient;
  let database: Db | PromiseLike<Db>;

  beforeAll(async () => {
    jest.setTimeout(10000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [UsersService],
      exports: [UsersService],
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

    service = module.get<UsersService>(UsersService);
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

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
});
