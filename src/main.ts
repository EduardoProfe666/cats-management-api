import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import setupSwagger from './config/swagger.setup';
import initSetup from './config/init.setup';
import setupSeeders from './config/seeders.setup';
import setupLogging from './config/logging.setup';

const SWAGGER_PATH = '/docs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = app.get(ConfigService).get<number>('APP_PORT');

  setupSwagger(app, SWAGGER_PATH)
  initSetup(app)
  await setupSeeders(app)

  await app.listen(port);

  setupLogging(app, SWAGGER_PATH);
}

bootstrap();
