import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../common/decorators/roles.decorator';
import CatUserOutDto from './cat-user.out.dto';

export default class UserWithCatsOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastnames: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({type: [CatUserOutDto]})
  cats: CatUserOutDto[]
}