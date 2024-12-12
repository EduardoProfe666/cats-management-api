import { ApiProperty } from '@nestjs/swagger';

export default class MiauOutDto{
  @ApiProperty()
  miau: string;
}