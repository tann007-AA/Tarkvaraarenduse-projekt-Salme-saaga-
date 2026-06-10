import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScoreItemDto {
  @ApiProperty({
    description: 'Type or category of score',
    example: 'combat',
    maxLength: 50,
    type: String,
  })
  scoreType: string;

  @ApiProperty({
    description: 'Numerical score value',
    example: 100,
    type: Number,
  })
  scoreValue: number;
}

export class UpdateScoreDto {
  @ApiProperty({
    description: 'Type or category of score to update',
    example: 'combat',
    maxLength: 50,
    type: String,
  })
  scoreType: string;

  @ApiProperty({
    description: 'New score value',
    example: 150,
    type: Number,
  })
  scoreValue: number;
}

export class AddScoreDto {
  @ApiProperty({
    description: 'Save slot number',
    example: 1,
    minimum: 1,
    maximum: 3,
    type: Number,
  })
  slotNumber: number;

  @ApiProperty({
    description: 'Type or category of score',
    example: 'combat',
    maxLength: 50,
    type: String,
  })
  scoreType: string;

  @ApiProperty({
    description: 'Score value',
    example: 100,
    type: Number,
  })
  scoreValue: number;
}

export class ScoreResponseDto {
  @ApiProperty({
    description: 'Score identifier',
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Save identifier this score belongs to',
    example: 'b2c3f613-4128-4e3e-83bf-9d346b413f8e',
    type: String,
  })
  saveId: string;

  @ApiProperty({
    description: 'Type or category of score',
    example: 'combat',
    type: String,
  })
  scoreType: string;

  @ApiProperty({
    description: 'Numerical score value',
    example: 100,
    type: Number,
  })
  scoreValue: number;

  @ApiProperty({
    description: 'Score creation timestamp',
    example: '2026-06-09T10:30:00.000Z',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  createdAt: string | null;

  @ApiProperty({
    description: 'Score update timestamp',
    example: '2026-06-09T10:45:00.000Z',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  updatedAt: string | null;
}

export class ScoresListResponseDto {
  @ApiProperty({
    description: 'List of scores for the save',
    type: [ScoreResponseDto],
  })
  scores: ScoreResponseDto[];
}

export class ScoreMessageResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Score updated successfully.',
    type: String,
  })
  message: string;
}
