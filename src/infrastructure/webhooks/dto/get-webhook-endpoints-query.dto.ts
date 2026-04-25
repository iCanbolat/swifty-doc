import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/http/pagination.dto';

export class GetWebhookEndpointsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'partner.example.com', maxLength: 200 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  search?: string;
}
