import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for user login
 */
export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecureP@ssw0rd',
    type: String,
    format: 'password',
  })
  password: string;

  @ApiProperty({
    description: 'Keep user logged in for extended period (30 days vs 1 day)',
    example: false,
    required: false,
    default: false,
    type: Boolean,
  })
  rememberMe?: boolean;
}
