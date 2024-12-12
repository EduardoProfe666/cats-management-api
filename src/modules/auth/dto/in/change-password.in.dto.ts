import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export default class ChangePasswordInDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[0-9])/, {
    message: 'newPassword must contain at least one number.',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'newPassword must contain at least one uppercase letter.',
  })
  newPassword: string;
}