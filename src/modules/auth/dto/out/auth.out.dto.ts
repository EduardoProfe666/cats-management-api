import { ApiProperty } from '@nestjs/swagger';

export declare class AuthOutDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}