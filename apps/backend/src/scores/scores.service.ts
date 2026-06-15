import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { randomUUID } from 'node:crypto';
import { DRIZZLE } from '../db/db.constants';
import { saves } from '../db/schema/gamesave.schema';
import { scores } from '../db/schema/scores.schema';
import type { AddScoreDto, UpdateScoreDto } from './dto';

const MAX_SAVE_SLOTS = 3;
const MAX_SCORE_TYPE_LENGTH = 50;

type ScoreRow = {
  id: string;
  saveId: string;
  scoreType: string;
  scoreValue: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

@Injectable()
export class ScoresService {
  constructor(@Inject(DRIZZLE) private readonly db: MySql2Database) { }

  async addOrUpdateScore(userId: string, input: AddScoreDto) {
    const slotNumber = this.validateSlot(input.slotNumber);
    const scoreType = this.validateScoreType(input.scoreType);
    const scoreValue = this.validateScoreValue(input.scoreValue);

    const saveRow = await this.findSaveRow(userId, slotNumber);

    if (!saveRow) {
      throw new NotFoundException('Save slot not found.');
    }

    const existingScore = await this.findScoreRow(saveRow.id, scoreType);

    if (existingScore) {
      await this.db
        .update(scores)
        .set({
          scoreValue,
        })
        .where(eq(scores.id, existingScore.id));

      const updatedScore = await this.getScoreById(existingScore.id);
      return updatedScore;
    } else {
      const scoreId = randomUUID();
      await this.db.insert(scores).values({
        id: scoreId,
        saveId: saveRow.id,
        scoreType,
        scoreValue,
      });

      const newScore = await this.getScoreById(scoreId);
      return newScore;
    }
  }

  async updateScore(
    userId: string,
    slotParam: string,
    scoreTypeParam: string,
    input: UpdateScoreDto,
  ) {
    const slotNumber = this.parseSlot(slotParam);
    const scoreType = this.validateScoreType(scoreTypeParam);
    const scoreValue = this.validateScoreValue(input.scoreValue);

    const saveRow = await this.findSaveRow(userId, slotNumber);

    if (!saveRow) {
      throw new NotFoundException('Save slot not found.');
    }

    const existingScore = await this.findScoreRow(saveRow.id, scoreType);

    if (!existingScore) {
      throw new NotFoundException('Score not found for this save slot.');
    }

    await this.db
      .update(scores)
      .set({
        scoreValue,
      })
      .where(eq(scores.id, existingScore.id));

    const updatedScore = await this.getScoreById(existingScore.id);
    return updatedScore;
  }

  async getScoresForSave(userId: string, slotParam: string) {
    const slotNumber = this.parseSlot(slotParam);
    const saveRow = await this.findSaveRow(userId, slotNumber);

    if (!saveRow) {
      throw new NotFoundException('Save slot not found.');
    }

    const scoreRows = await this.db
      .select({
        id: scores.id,
        saveId: scores.saveId,
        scoreType: scores.scoreType,
        scoreValue: scores.scoreValue,
        createdAt: scores.createdAt,
        updatedAt: scores.updatedAt,
      })
      .from(scores)
      .where(eq(scores.saveId, saveRow.id))
      .orderBy(asc(scores.scoreType));

    return {
      scores: scoreRows.map((row) => this.toScoreResponse(row)),
    };
  }

  async deleteScore(
    userId: string,
    slotParam: string,
    scoreTypeParam: string,
  ) {
    const slotNumber = this.parseSlot(slotParam);
    const scoreType = this.validateScoreType(scoreTypeParam);

    const saveRow = await this.findSaveRow(userId, slotNumber);

    if (!saveRow) {
      throw new NotFoundException('Save slot not found.');
    }

    const existingScore = await this.findScoreRow(saveRow.id, scoreType);

    if (!existingScore) {
      throw new NotFoundException('Score not found for this save slot.');
    }

    await this.db.delete(scores).where(eq(scores.id, existingScore.id));

    return { message: 'Score deleted successfully.' };
  }

  private async findSaveRow(userId: string, slotNumber: number) {
    const [saveRow] = await this.db
      .select({ id: saves.id })
      .from(saves)
      .where(and(eq(saves.userId, userId), eq(saves.slotNumber, slotNumber)));

    return saveRow;
  }

  private async findScoreRow(saveId: string, scoreType: string) {
    const [scoreRow] = await this.db
      .select({
        id: scores.id,
        saveId: scores.saveId,
        scoreType: scores.scoreType,
        scoreValue: scores.scoreValue,
        createdAt: scores.createdAt,
        updatedAt: scores.updatedAt,
      })
      .from(scores)
      .where(and(eq(scores.saveId, saveId), eq(scores.scoreType, scoreType)));

    return scoreRow;
  }

  private async getScoreById(scoreId: string) {
    const [scoreRow] = await this.db
      .select({
        id: scores.id,
        saveId: scores.saveId,
        scoreType: scores.scoreType,
        scoreValue: scores.scoreValue,
        createdAt: scores.createdAt,
        updatedAt: scores.updatedAt,
      })
      .from(scores)
      .where(eq(scores.id, scoreId));

    if (!scoreRow) {
      throw new NotFoundException('Score not found.');
    }

    return this.toScoreResponse(scoreRow);
  }

  private parseSlot(slotParam: string) {
    const slotNumber = Number(slotParam);
    return this.validateSlot(slotNumber);
  }

  private validateSlot(slotNumber: number) {
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

  private validateScoreType(scoreType: string) {
    const trimmedScoreType = scoreType?.trim();

    if (!trimmedScoreType) {
      throw new BadRequestException('Score type is required.');
    }

    if (trimmedScoreType.length > MAX_SCORE_TYPE_LENGTH) {
      throw new BadRequestException(
        `Score type must be at most ${MAX_SCORE_TYPE_LENGTH} characters.`,
      );
    }

    return trimmedScoreType;
  }

  private validateScoreValue(scoreValue: number) {
    if (!Number.isInteger(scoreValue)) {
      throw new BadRequestException('Score value must be an integer.');
    }

    return scoreValue;
  }

  private toScoreResponse(scoreRow: ScoreRow) {
    return {
      id: scoreRow.id,
      saveId: scoreRow.saveId,
      scoreType: scoreRow.scoreType,
      scoreValue: scoreRow.scoreValue,
      createdAt: this.toIsoString(scoreRow.createdAt),
      updatedAt: this.toIsoString(scoreRow.updatedAt),
    };
  }

  private toIsoString(value: Date | null) {
    return value?.toISOString() ?? null;
  }
}
