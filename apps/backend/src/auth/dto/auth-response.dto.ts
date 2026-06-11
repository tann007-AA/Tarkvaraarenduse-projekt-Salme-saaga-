import { ApiProperty } from '@nestjs/swagger';

/**
 * User information in authentication responses
 */
export class UserResponseDto {
  @ApiProperty({
    description: 'Unique user identifier',
    example: 'ckx5g9j8d0000qzr0g5x7n9q1',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
    type: String,
  })
  username: string;

  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: string;
}

/**
 * Authentication response with tokens
 */
export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token for authenticated requests',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token for obtaining new access tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  refreshToken: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}

/**
 * Session information
 */
export class SessionDto {
  @ApiProperty({
    description: 'Session identifier',
    example: 'ckx5g9j8d0001qzr0g5x7n9q2',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'User agent string from the session',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    type: String,
    nullable: true,
  })
  userAgent: string | null;

  @ApiProperty({
    description: 'IP address of the session',
    example: '192.168.1.100',
    type: String,
    nullable: true,
  })
  ipAddress: string | null;

  @ApiProperty({
    description: 'Session creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last activity timestamp',
    example: '2024-01-15T14:45:00.000Z',
    type: String,
    format: 'date-time',
  })
  lastUsedAt: string;

  @ApiProperty({
    description: 'Session expiration timestamp',
    example: '2024-02-15T10:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  expiresAt: string;
}

/**
 * Array of user sessions
 */
export class SessionsResponseDto {
  @ApiProperty({
    description: 'List of active sessions',
    type: [SessionDto],
  })
  sessions: SessionDto[];
}

/**
 * Token refresh response
 */
export class RefreshResponseDto {
  @ApiProperty({
    description: 'New JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    description: 'New refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  refreshToken: string;
}

/**
 * Success message response
 */
export class MessageResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Logged out successfully',
    type: String,
  })
  message: string;
}
