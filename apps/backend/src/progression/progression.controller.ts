import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { ProgressionResponseDto, UpdateProgressionDto } from './dto';
import { ProgressionService } from './progression.service';

@ApiTags('Progression')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('saves/:slot/progression')
export class ProgressionController {
  constructor(private readonly progressionService: ProgressionService) {}

  @Get()
  @ApiOperation({
    summary: 'Get story progression for a save slot',
    description:
      'Returns the current chapter and quest progress for the story mode stage flow.',
  })
  @ApiParam({ name: 'slot', example: 1, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Progression loaded successfully',
    type: ProgressionResponseDto,
  })
  getProgression(
    @CurrentUser() user: { id: string },
    @Param('slot') slot: string,
  ) {
    return this.progressionService.getProgression(user.id, slot);
  }

  @Patch()
  @ApiOperation({
    summary: 'Update story progression for a save slot',
    description:
      'Updates chapter, completed quest count, and ending flags without changing inventory or save metadata.',
  })
  @ApiParam({ name: 'slot', example: 1, type: Number })
  @ApiBody({ type: UpdateProgressionDto })
  @ApiResponse({
    status: 200,
    description: 'Progression updated successfully',
    type: ProgressionResponseDto,
  })
  updateProgression(
    @CurrentUser() user: { id: string },
    @Param('slot') slot: string,
    @Body() body: UpdateProgressionDto,
  ) {
    return this.progressionService.updateProgression(user.id, slot, body);
  }

  @Post('advance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Advance to the next story chapter',
    description:
      'Moves the save slot to the next PDF story stage, up to the final burial chapter.',
  })
  @ApiParam({ name: 'slot', example: 1, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Progression advanced successfully',
    type: ProgressionResponseDto,
  })
  advanceChapter(
    @CurrentUser() user: { id: string },
    @Param('slot') slot: string,
  ) {
    return this.progressionService.advanceChapter(user.id, slot);
  }
}
