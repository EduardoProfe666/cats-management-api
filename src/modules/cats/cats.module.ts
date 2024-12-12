import { Module } from '@nestjs/common';
import DatabaseModule from '../database/database.module';
import AuthModule from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import V1CatsController from './controllers/v1-cats.controller';
import CatsService from './services/cats.service';


@Module({
  imports: [AuthModule, ConfigModule, DatabaseModule],
  controllers: [V1CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export default class CatsModule {}