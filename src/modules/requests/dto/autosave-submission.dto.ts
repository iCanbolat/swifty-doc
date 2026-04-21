import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const ANSWERED_BY_TYPE_VALUES = ['recipient', 'reviewer', 'system'] as const;
const ANSWER_SOURCE_VALUES = ['portal', 'api'] as const;

export class AutosaveAnswerInputDto {
  @ApiProperty({ example: 'submission_item_123', maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  submissionItemId!: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      text: 'Company registration number uploaded.',
    },
  })
  @IsObject()
  value!: Record<string, unknown>;
}

export class AutosaveSubmissionAnswersDto {
  @ApiProperty({ example: 'org_123', maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  organizationId!: string;

  @ApiProperty({ type: () => AutosaveAnswerInputDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AutosaveAnswerInputDto)
  answers!: AutosaveAnswerInputDto[];

  @ApiPropertyOptional({
    enum: ANSWERED_BY_TYPE_VALUES,
    enumName: 'AnsweredByType',
    example: 'recipient',
    default: 'recipient',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(ANSWERED_BY_TYPE_VALUES)
  answeredByType?: (typeof ANSWERED_BY_TYPE_VALUES)[number];

  @ApiPropertyOptional({ example: 'recipient_123', maxLength: 120 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  answeredById?: string;

  @ApiPropertyOptional({
    enum: ANSWER_SOURCE_VALUES,
    enumName: 'AnswerSource',
    example: 'portal',
    default: 'portal',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(ANSWER_SOURCE_VALUES)
  source?: (typeof ANSWER_SOURCE_VALUES)[number];
}
