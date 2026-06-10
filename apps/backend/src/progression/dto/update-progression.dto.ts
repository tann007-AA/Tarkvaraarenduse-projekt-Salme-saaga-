import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProgressionDto {
  @ApiPropertyOptional({
    description: 'Current story chapter from the PDF stage flow',
    example: 3,
    minimum: 1,
    maximum: 5,
    type: Number,
  })
  currentChapter?: number;

  @ApiPropertyOptional({
    description: 'Number of completed story tasks or quests',
    example: 4,
    minimum: 0,
    type: Number,
  })
  completedQuestCount?: number;

  @ApiPropertyOptional({
    description: 'Whether ending A has been completed',
    example: false,
    type: Boolean,
  })
  completedEndingA?: boolean;

  @ApiPropertyOptional({
    description: 'Whether ending B has been completed',
    example: false,
    type: Boolean,
  })
  completedEndingB?: boolean;
}
