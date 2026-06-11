import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { DRIZZLE } from '../db/db.module';
import { saves } from '../db/schema/gamesave.schema';
import { progress } from '../db/schema/progress.schema';
import type { UpdateProgressionDto } from './dto';

const MAX_SAVE_SLOTS = 3;
const CHAPTER_TITLES = new Map<number, string>([
  [1, 'Sveamaa pikkmaja - supp ja saatus'],
  [2, 'Saatus, Valhalla ja kavalate strateegide mang'],
  [3, 'Sveamaa rannik - Lohe aratamine'],
  [4, 'Avameri ja saatuslik rannik'],
  [5, 'Reetmine ja laev malestus'],
]);

type ProgressionState = {
  currentChapter: number;
  completedQuestCount: number;
  completedEndingA: boolean;
  completedEndingB: boolean;
};

@Injectable()
export class ProgressionService {
  constructor(@Inject(DRIZZLE) private readonly db: MySql2Database) {}

  async getProgression(userId: string, slotParam: string) {
    const save = await this.getSaveForUser(userId, slotParam);
    const state = await this.findOrCreateProgression(save.id);

    return this.toResponse(save.slotNumber, state);
  }

  async updateProgression(
    userId: string,
    slotParam: string,
    input: UpdateProgressionDto,
  ) {
    this.validateUpdateInput(input);
    const save = await this.getSaveForUser(userId, slotParam);
    const currentState = await this.findOrCreateProgression(save.id);
    const nextState = this.normalizeUpdate(input, currentState);

    await this.db
      .update(progress)
      .set(nextState)
      .where(eq(progress.saveId, save.id));

    return this.toResponse(save.slotNumber, nextState);
  }

  async advanceChapter(userId: string, slotParam: string) {
    const save = await this.getSaveForUser(userId, slotParam);
    const currentState = await this.findOrCreateProgression(save.id);

    if (currentState.currentChapter >= CHAPTER_TITLES.size) {
      throw new BadRequestException('Already at the final chapter.');
    }

    const nextState = {
      ...currentState,
      currentChapter: currentState.currentChapter + 1,
    };

    await this.db
      .update(progress)
      .set(nextState)
      .where(eq(progress.saveId, save.id));

    return this.toResponse(save.slotNumber, nextState);
  }

  private async getSaveForUser(userId: string, slotParam: string) {
    const slotNumber = this.parseSlot(slotParam);
    const [save] = await this.db
      .select({ id: saves.id, slotNumber: saves.slotNumber })
      .from(saves)
      .where(and(eq(saves.userId, userId), eq(saves.slotNumber, slotNumber)));

    if (!save) {
      throw new NotFoundException('Save slot not found.');
    }

    return save;
  }

  private async findOrCreateProgression(saveId: string) {
    const [existingProgression] = await this.db
      .select({
        currentChapter: progress.currentChapter,
        completedQuestCount: progress.completedQuestCount,
        completedEndingA: progress.completedEndingA,
        completedEndingB: progress.completedEndingB,
      })
      .from(progress)
      .where(eq(progress.saveId, saveId));

    if (existingProgression) {
      return existingProgression;
    }

    const defaultProgression = {
      currentChapter: 1,
      completedQuestCount: 0,
      completedEndingA: false,
      completedEndingB: false,
    };

    await this.db.insert(progress).values({
      saveId,
      ...defaultProgression,
    });

    return defaultProgression;
  }

  private normalizeUpdate(
    input: UpdateProgressionDto,
    currentState: ProgressionState,
  ) {
    return {
      currentChapter:
        input.currentChapter === undefined
          ? currentState.currentChapter
          : this.validateChapter(input.currentChapter),
      completedQuestCount:
        input.completedQuestCount === undefined
          ? currentState.completedQuestCount
          : this.validateNonNegativeInteger(
              input.completedQuestCount,
              'Completed quest count',
            ),
      completedEndingA:
        input.completedEndingA === undefined
          ? currentState.completedEndingA
          : this.validateBoolean(input.completedEndingA),
      completedEndingB:
        input.completedEndingB === undefined
          ? currentState.completedEndingB
          : this.validateBoolean(input.completedEndingB),
    };
  }

  private validateUpdateInput(input: UpdateProgressionDto) {
    if (input.currentChapter !== undefined) {
      this.validateChapter(input.currentChapter);
    }

    if (input.completedQuestCount !== undefined) {
      this.validateNonNegativeInteger(
        input.completedQuestCount,
        'Completed quest count',
      );
    }

    if (input.completedEndingA !== undefined) {
      this.validateBoolean(input.completedEndingA);
    }

    if (input.completedEndingB !== undefined) {
      this.validateBoolean(input.completedEndingB);
    }
  }

  private parseSlot(slotParam: string) {
    const slotNumber = Number(slotParam);

    if (
      !Number.isInteger(slotNumber) ||
      slotNumber < 1 ||
      slotNumber > MAX_SAVE_SLOTS
    ) {
      throw new BadRequestException(
        `Slot number must be an integer between 1 and ${MAX_SAVE_SLOTS}.`,
      );
    }

    return slotNumber;
  }

  private validateChapter(chapter: number) {
    if (!Number.isInteger(chapter) || !CHAPTER_TITLES.has(chapter)) {
      throw new BadRequestException(
        `Current chapter must be an integer between 1 and ${CHAPTER_TITLES.size}.`,
      );
    }

    return chapter;
  }

  private validateNonNegativeInteger(value: number, fieldName: string) {
    if (!Number.isInteger(value) || value < 0) {
      throw new BadRequestException(
        `${fieldName} must be a non-negative integer.`,
      );
    }

    return value;
  }

  private validateBoolean(value: boolean) {
    if (typeof value !== 'boolean') {
      throw new BadRequestException(
        'Ending completion flags must be booleans.',
      );
    }

    return value;
  }

  private toResponse(slotNumber: number, state: ProgressionState) {
    return {
      slotNumber,
      currentChapter: state.currentChapter,
      chapterTitle: CHAPTER_TITLES.get(state.currentChapter) ?? 'Unknown',
      completedQuestCount: state.completedQuestCount,
      completedEndingA: state.completedEndingA,
      completedEndingB: state.completedEndingB,
    };
  }
}
