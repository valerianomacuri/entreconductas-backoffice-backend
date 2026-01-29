// LoginResponseDto models the JWT access token returned after authentication.
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  readonly access_token: string;
}
