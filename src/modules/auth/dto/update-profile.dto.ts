import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import {
  MAX_LENGTH_AVATAR_URL,
  MAX_LENGTH_FULL_NAME,
  MAX_LENGTH_PHONE,
} from '../auth.constants';

const PHONE_DIGITS_PATTERN = /^\+\d+$/;
const IMAGE_DATA_URL_PATTERN =
  /^data:image\/(?:png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=\r\n]+$/i;

export class UpdateProfileDto {
  @ApiProperty({ example: 'Aylin Demir' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_LENGTH_FULL_NAME)
  fullName!: string;

  @ApiPropertyOptional({ example: '+905551112233', nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_LENGTH_PHONE)
  @Matches(PHONE_DIGITS_PATTERN, {
    message: 'phone must be a valid E.164 phone number starting with +.',
  })
  phone?: string | null;

  @ApiPropertyOptional({
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_LENGTH_AVATAR_URL)
  @Matches(IMAGE_DATA_URL_PATTERN, {
    message: 'avatarUrl must be a valid base64-encoded image data URL.',
  })
  avatarUrl?: string | null;
}
