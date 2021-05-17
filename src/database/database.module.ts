import { Module } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';

@Module({
  // imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<Db> => {
        // useFactory: async (): Promise<Db> => {
        try {
          const client = await MongoClient.connect(
            // 'mongodb+srv://testUser:testuser@test.37thw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            configService.get<string>('TEST_DATABASE_CONNECTION'),
            {
              useUnifiedTopology: true,
            },
          );

          // return client.db('amnesty-test');
          return client.db(configService.get<string>('TEST_DATABASE_NAME'));
        } catch (e) {
          throw e;
        }
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
