import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString, Max,
  MaxLength, Min,
} from 'class-validator';

export default class CatInDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(30)
  age: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  breedId: number;
}
