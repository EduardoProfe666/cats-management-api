import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export default function setupLogging(app: INestApplication, swaggerPath: string) {
  const logger = new Logger('AppBootstrap');
  const port = app.get(ConfigService).get<number>('APP_PORT');

  logger.log('Listening in port ' + port);

  const address = app.getHttpServer().address();
  const host = address.address === '::' ? 'localhost' : address.address;
  const appUrl = `http://${host}:${address.port}`;
  logger.log(`Swagger is available on: ${appUrl}${swaggerPath}`);
}