import { Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {
    this.connectDb();
  }

  async connectDb(): Promise<Db> {
    try {
      const client = await MongoClient.connect(
        // 'mongodb+srv://testUser:testuser@test.37thw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        this.configService.get<string>('TEST_DATABASE_CONNECTION'),
        {
          useUnifiedTopology: true,
        },
      );
      //   return client.db('amnesty-test');
      return client.db(this.configService.get<string>('TEST_DATABASE_NAME'));
    } catch (e) {
      throw e;
    }
  }
}
