import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  AddScoreDto,
  ScoreMessageResponseDto,
  ScoreResponseDto,
  ScoresListResponseDto,
  UpdateScoreDto,
} from './dto';
import { ScoresService } from './scores.service';

@ApiTags('Scores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add or update a score',
    description:
      'Creates a new score or updates an existing score for a save slot. If a score with the same type already exists for the slot, it will be updated.',
  })
  @ApiBody({ type: AddScoreDto })
  @ApiResponse({
    status: 200,
    description: 'Score created or updated successfully',
    type: ScoreResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid score data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiResponse({ status: 404, description: 'Save slot not found' })
  addScore(@CurrentUser() user: { id: string }, @Body() body: AddScoreDto) {
    return this.scoresService.addOrUpdateScore(user.id, body);
  }

  @Get(':slot')
  @ApiOperation({
    summary: 'Get all scores for a save slot',
    description: 'Returns all scores associated with a specific save slot.',
  })
  @ApiParam({
    name: 'slot',
    description: 'Save slot number',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Scores retrieved successfully',
    type: ScoresListResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid slot number' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiResponse({ status: 404, description: 'Save slot not found' })
  getScores(@CurrentUser() user: { id: string }, @Param('slot') slot: string) {
    return this.scoresService.getScoresForSave(user.id, slot);
  }

  @Put(':slot/:scoreType')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a specific score',
    description: 'Updates the value of a specific score type for a save slot.',
  })
  @ApiParam({
    name: 'slot',
    description: 'Save slot number',
    example: 1,
    type: Number,
  })
  @ApiParam({
    name: 'scoreType',
    description: 'Type of score to update',
    example: 'combat',
    type: String,
  })
  @ApiBody({ type: UpdateScoreDto })
  @ApiResponse({
    status: 200,
    description: 'Score updated successfully',
    type: ScoreResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiResponse({
    status: 404,
    description: 'Save slot or score not found',
  })
  updateScore(
    @CurrentUser() user: { id: string },
    @Param('slot') slot: string,
    @Param('scoreType') scoreType: string,
    @Body() body: UpdateScoreDto,
  ) {
    return this.scoresService.updateScore(user.id, slot, scoreType, body);
  }

  @Delete(':slot/:scoreType')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a specific score',
    description: 'Deletes a specific score type from a save slot.',
  })
  @ApiParam({
    name: 'slot',
    description: 'Save slot number',
    example: 1,
    type: Number,
  })
  @ApiParam({
    name: 'scoreType',
    description: 'Type of score to delete',
    example: 'combat',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Score deleted successfully',
    type: ScoreMessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiResponse({
    status: 404,
    description: 'Save slot or score not found',
  })
  deleteScore(
    @CurrentUser() user: { id: string },
    @Param('slot') slot: string,
    @Param('scoreType') scoreType: string,
  ) {
    return this.scoresService.deleteScore(user.id, slot, scoreType);
  }
}
