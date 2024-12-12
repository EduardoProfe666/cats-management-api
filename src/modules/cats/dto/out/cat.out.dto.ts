import { ApiProperty } from '@nestjs/swagger';

export default class CatOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  breedId: number;

  @ApiProperty()
  breedName: string;

  @ApiProperty()
  ownerId: number;

  @ApiProperty()
  ownerName: string;

  @ApiProperty()
  ownerUsername: string;

  @ApiProperty()
  ownerEmail: string;
}