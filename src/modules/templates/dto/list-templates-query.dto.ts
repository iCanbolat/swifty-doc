import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/http/pagination.dto';
import {
  TEMPLATE_STATUS_VALUES,
  type TemplateStatus,
} from '../templates.types';

export class ListTemplatesQueryDto extends PaginationQueryDto {
  @ApiProperty({ example: 'ws_123', maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  workspaceId!: string;

  @ApiPropertyOptional({ example: 'kyc', maxLength: 160 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  search?: string;

  @ApiPropertyOptional({
    enum: TEMPLATE_STATUS_VALUES,
    enumName: 'TemplateStatus',
    example: 'draft',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(TEMPLATE_STATUS_VALUES)
  status?: TemplateStatus;
}
