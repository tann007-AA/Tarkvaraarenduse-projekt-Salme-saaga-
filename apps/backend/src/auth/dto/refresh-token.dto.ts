import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for refreshing access tokens
 */
export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token received during login',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  refreshToken: string;
}
