// LoginDto defines the expected payload for the login endpoint.
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ minLength: 6, example: 'strongPassword123' })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
