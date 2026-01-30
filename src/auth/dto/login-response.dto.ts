// LoginResponseDto models the JWT access token returned after authentication.
import { User } from '@/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  readonly access_token: string;

  @ApiProperty({ description: 'User details' })
  readonly user: User;
}
