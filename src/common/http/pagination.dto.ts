import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export interface PaginationParams {
  offset: number;
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export class PaginationQueryDto {
  @ApiPropertyOptional({
    default: DEFAULT_PAGE,
    example: DEFAULT_PAGE,
    minimum: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    default: DEFAULT_PAGE_SIZE,
    example: DEFAULT_PAGE_SIZE,
    maximum: MAX_PAGE_SIZE,
    minimum: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  pageSize?: number = DEFAULT_PAGE_SIZE;
}

export class PaginationMetaDto {
  @ApiProperty({ example: false })
  hasNextPage!: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage!: boolean;

  @ApiProperty({ example: DEFAULT_PAGE })
  page!: number;

  @ApiProperty({ example: DEFAULT_PAGE_SIZE })
  pageSize!: number;

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 2 })
  totalPages!: number;
}

export function resolvePagination(
  query: Pick<PaginationQueryDto, 'page' | 'pageSize'>,
): PaginationParams {
  const page = query.page ?? DEFAULT_PAGE;
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}

export function createPaginationMeta(
  total: number,
  pagination: Pick<PaginationParams, 'page' | 'pageSize'>,
): PaginationMeta {
  const totalPages = total === 0 ? 0 : Math.ceil(total / pagination.pageSize);

  return {
    page: pagination.page,
    pageSize: pagination.pageSize,
    total,
    totalPages,
    hasPreviousPage: pagination.page > 1,
    hasNextPage: pagination.page < totalPages,
  };
}

export function paginateResult<T>(
  data: T[],
  total: number,
  pagination: PaginationParams,
): PaginatedResult<T> {
  return {
    data,
    meta: createPaginationMeta(total, pagination),
  };
}
