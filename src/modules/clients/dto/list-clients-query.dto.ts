import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/http/pagination.dto';
import { CLIENT_STATUS_VALUES, type ClientStatus } from '../clients.types';

export class ListClientsQueryDto extends PaginationQueryDto {
  @ApiProperty({ example: 'ws_123', maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  workspaceId!: string;

  @ApiPropertyOptional({ example: 'acme', maxLength: 160 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  search?: string;

  @ApiPropertyOptional({
    enum: CLIENT_STATUS_VALUES,
    enumName: 'ClientStatus',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(CLIENT_STATUS_VALUES)
  status?: ClientStatus;
}
