import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class TransitionRequestDto {
  @ApiProperty({ example: 'org_123', maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  organizationId!: string;

  @ApiPropertyOptional({ example: 'user_123', maxLength: 120 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  actorUserId?: string;

  @ApiPropertyOptional({
    example: 'Client requested additional edits before final completion.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
