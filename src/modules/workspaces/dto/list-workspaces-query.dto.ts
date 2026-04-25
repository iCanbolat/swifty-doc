import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/http/pagination.dto';
import {
  WORKSPACE_STATUS_VALUES,
  type WorkspaceStatus,
} from '../workspaces.types';

export class ListWorkspacesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'delivery', maxLength: 160 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  search?: string;

  @ApiPropertyOptional({
    enum: WORKSPACE_STATUS_VALUES,
    enumName: 'WorkspaceStatus',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(WORKSPACE_STATUS_VALUES)
  status?: WorkspaceStatus;
}
