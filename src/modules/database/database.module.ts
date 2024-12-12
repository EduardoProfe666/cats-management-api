import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import PgService from './services/pg.service';
import Cat from './entities/cat.entity';
import Breed from './entities/breed.entity';
import RefreshToken from './entities/refresh-token.entity';
import User from './entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        synchronize: true,
        entities: [
          Breed,
          Cat,
          RefreshToken,
          User,
        ],
      }),
    }),
    TypeOrmModule.forFeature([
      Breed,
      Cat,
      RefreshToken,
      User,
    ]),
  ],
  exports: [PgService],
  providers: [PgService],
})
export default class DatabaseModule {
}
