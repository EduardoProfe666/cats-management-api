import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../common/decorators/roles.decorator';

export default class UserOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastNames: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  isActive: boolean;
}