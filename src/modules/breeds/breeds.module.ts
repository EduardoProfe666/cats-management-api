import { Module } from '@nestjs/common';
import DatabaseModule from '../database/database.module';
import AuthModule from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import V1BreedsController from './controllers/v1-breeds.controller';
import BreedsService from './services/breeds.service';


@Module({
  imports: [AuthModule, ConfigModule, DatabaseModule],
  controllers: [V1BreedsController],
  providers: [BreedsService],
  exports: [BreedsService],
})
export default class BreedsModule {}