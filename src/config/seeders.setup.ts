import { INestApplication } from '@nestjs/common';
import AdminSeederService from '../modules/users/seeders/admin-seeder.service';

export default async function setupSeeders(app: INestApplication) {
  const userSeederService = app.get(AdminSeederService);
  await userSeederService.createAdminUser();
}