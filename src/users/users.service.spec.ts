import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongoClient, Db, ObjectID } from 'mongodb';

const userDTO = {
  // _id: '608367097be99ac8ed4462a5',
  user_info: {
    firstname: 'Tinotenda',
    initials: '',
    surname: 'Mutezo',
  },
  username: 'tino',
  email: 'tino@gmail.com',
  password: 'tino123',
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'DATABASE_CONNECTION',
          useFactory: async (): Promise<Db> => {
            try {
              const client = await MongoClient.connect(
                'mongodb+srv://testUser:testuser@test.37thw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
                {
                  useUnifiedTopology: true,
                },
              );

              return await client.db('amnesty-test');
            } catch (e) {
              throw e;
            }
          },
        },
      ],
    }).compile();

    service = await module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new user and return', async () => {
    const createdUser = await service.create(userDTO);
    console.log(createdUser);
    // expect(createdUser).toEqual({
    //   _id: ObjectID,
    //   ...userDTO,
    // });
  });

  // it('should return all users', async () => {
  //   expect(await service.findAll()).toHaveLength(1);
  // });
});
