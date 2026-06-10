import { ApiProperty } from '@nestjs/swagger';

export class ProgressionResponseDto {
  @ApiProperty({
    description: 'Save slot number',
    example: 1,
    type: Number,
  })
  slotNumber: number;

  @ApiProperty({
    description: 'Current story chapter',
    example: 3,
    type: Number,
  })
  currentChapter: number;

  @ApiProperty({
    description: 'Human-readable chapter name from the story PDF',
    example: 'Sveamaa rannik - Lohe aratamine',
    type: String,
  })
  chapterTitle: string;

  @ApiProperty({
    description: 'Number of completed story tasks or quests',
    example: 4,
    type: Number,
  })
  completedQuestCount: number;

  @ApiProperty({
    description: 'Whether ending A has been completed',
    example: false,
    type: Boolean,
  })
  completedEndingA: boolean;

  @ApiProperty({
    description: 'Whether ending B has been completed',
    example: false,
    type: Boolean,
  })
  completedEndingB: boolean;
}
