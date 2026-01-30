// AuthController exposes the authentication endpoints consumed by clients.
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { User } from '@/users/entities/user.entity';
import { JwtAuthGuard } from './jwt.guard';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and retrieve an access token' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'JWT access token', type: LoginResponseDto })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve details of the authenticated user' })
  @ApiOkResponse({ description: 'Authenticated user details', type: User })
  async me(@Request() req): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.me(req.user as JwtPayload);
  }
}
