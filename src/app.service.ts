import { BadRequestException, Injectable } from '@nestjs/common';
import { WaterfallService } from './commons/waterfall/waterfall.service';
import { Step } from './decorators/step.decorator';
import { Rollback } from './decorators/rollback.decorator';

@Injectable()
export class AppService extends WaterfallService {
  @Step(1)
  async logFirst(eventId, data) {
    console.log('Step 1 [eventId]:', eventId);
    console.log('Step 1 [data]:', data);

    return {
      step: 1,
      message: 'this data from step 1',
    };
  }

  @Rollback(1)
  async fallbackFirst(eventId) {
    console.log('Rollback 1 [eventId]:', eventId);
  }

  @Step(2)
  async logSecond(eventId, data) {
    console.log('Step 2 [eventId]:', eventId);
    console.log('Step 2 [data]:', data);

    return {
      step: 2,
      message: 'this data from step 2',
    };
  }

  @Rollback(2)
  async fallbackSecond(eventId) {
    console.log('Rollback 2 [eventId]:', eventId);
  }

  @Step(3)
  async logThird(eventId) {
    throw new BadRequestException('Something error in step 3');
  }

  @Rollback(3)
  async fallbackThird(eventId) {
    console.log('Rollback 3 [eventId]:', eventId);
  }

  async execute() {
    const data = { step: 0, message: 'this data from initial function' };
    await this.executeSteps(data);
    return 'Step Executed';
  }
}
