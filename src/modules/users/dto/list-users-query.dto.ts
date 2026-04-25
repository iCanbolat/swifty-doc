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
  MANAGED_USER_STATUS_VALUES,
  type ManagedUserStatus,
} from '../users.types';

export class ListUsersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'aylin', maxLength: 160 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  search?: string;

  @ApiPropertyOptional({
    enum: MANAGED_USER_STATUS_VALUES,
    enumName: 'ManagedUserStatus',
    example: 'invited',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(MANAGED_USER_STATUS_VALUES)
  status?: ManagedUserStatus;

  @ApiPropertyOptional({ example: 'ws_123', maxLength: 120 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  workspaceId?: string;
}
