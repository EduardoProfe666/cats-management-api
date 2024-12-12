import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import CatsModule from './modules/cats/cats.module';
import { envSchema } from './config/env.schema';
import AuthModule from './modules/auth/auth.module';
import UsersModule from './modules/users/users.module';
import DatabaseModule from './modules/database/database.module';
import BreedsModule from './modules/breeds/breeds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envSchema,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
    ]),
    AuthModule,
    BreedsModule,
    CatsModule,
    DatabaseModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
