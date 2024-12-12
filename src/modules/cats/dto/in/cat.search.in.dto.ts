import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString, Min,
} from 'class-validator';
import PaginatedInDto from '../../../../common/dto/pagination/paginated.in.dto';
import { Transform } from 'class-transformer';

export default class CatSearchInDto extends PaginatedInDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  search?: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  breedId?: number;

  @ApiProperty({required: false})
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  ownerId: number;
}