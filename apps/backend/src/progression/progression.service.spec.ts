import { BadRequestException } from '@nestjs/common';
import { ProgressionService } from './progression.service';

describe('ProgressionService validation', () => {
  const createService = () => new ProgressionService({} as never);

  it('rejects chapters outside the story stage flow before persistence is used', async () => {
    const service = createService();

    await expect(
      service.updateProgression('user-1', '1', {
        currentChapter: 6,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects negative completed quest counts before persistence is used', async () => {
    const service = createService();

    await expect(
      service.updateProgression('user-1', '1', {
        completedQuestCount: -1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
