import { ApiProperty } from '@nestjs/swagger';

export default class TranslationOutDto {
  @ApiProperty()
  translation: string;
}