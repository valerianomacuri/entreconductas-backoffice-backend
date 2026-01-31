// users/dto/find-all-users.dto.ts
import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllUsersDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'orderByDate must be "asc" or "desc"' })
  orderByDate: 'asc' | 'desc' = 'desc';
}
