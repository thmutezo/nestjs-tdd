import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

dotenv.config();
@Injectable()
export class DatabaseService {
  constructor() {
    return (async () => {
      try {
        const client = await MongoClient.connect(
          process.env.LOCAL_TEST_DATABASE_CONNECTION,
          // this.configService.get<string>('LOCAL_TEST_DATABASE_CONNECTION'),
          {
            useUnifiedTopology: true,
          },
        );
        return client.db(process.env.TEST_DATABASE_NAME);
        // return client.db(this.configService.get<string>('TEST_DATABASE_NAME'));
      } catch (e) {
        throw e;
      }
    })();
  }
}
