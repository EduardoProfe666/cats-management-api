import { ApiProperty } from '@nestjs/swagger';

export default class CatUserOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}