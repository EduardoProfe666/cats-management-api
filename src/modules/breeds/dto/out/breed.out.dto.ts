import { ApiProperty } from '@nestjs/swagger';

export default class BreedOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}