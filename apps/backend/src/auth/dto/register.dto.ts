import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for user registration
 */
export class RegisterDto {
  @ApiProperty({
    description: 'User email address - must be unique',
    example: 'user@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Unique username for the user',
    example: 'johndoe',
    minLength: 3,
    maxLength: 30,
    type: String,
  })
  username: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 1,
    maxLength: 100,
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'User password - should be at least 8 characters',
    example: 'SecureP@ssw0rd',
    minLength: 8,
    type: String,
    format: 'password',
  })
  password: string;
}
