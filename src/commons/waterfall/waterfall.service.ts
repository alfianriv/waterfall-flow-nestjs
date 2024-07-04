import { Injectable } from '@nestjs/common';
import { ROLLBACK_STEP_METADATA_KEY } from 'src/decorators/rollback.decorator';
import { STEP_METADATA_KEY } from 'src/decorators/step.decorator';
import { uid } from 'uid';

@Injectable()
export class WaterfallService {
  private steps: { methodName: string; order: number }[] = [];
  private fallbacks: { methodName: string; order: number }[] = [];
  private forNextData: any;

  constructor() {
    this.collectSteps();
  }

  private collectSteps() {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    methods.forEach((methodName) => {
      const order = Reflect.getMetadata(STEP_METADATA_KEY, this, methodName);
      if (order !== undefined) {
        this.steps.push({ methodName, order });
      }

      const fallbackOrder = Reflect.getMetadata(
        ROLLBACK_STEP_METADATA_KEY,
        this,
        methodName,
      );
      if (fallbackOrder !== undefined) {
        this.fallbacks.push({ methodName, order: fallbackOrder });
      }
    });

    this.steps.sort((a, b) => a.order - b.order);
    this.fallbacks.sort((a, b) => a.order - b.order);
  }

  async executeSteps(params?) {
    const eventId = uid(6);
    let executedSteps = [];
    let returnedData;
    try {
      const result = await (this as any)[this.steps[0].methodName](eventId, params);
      executedSteps.push(this.steps[0]);
      returnedData = result;
      // Run the rest of the steps in the background
      this.runRemainingSteps(executedSteps, eventId);
    } catch (error) {
      await this.executeFallbacks(executedSteps, eventId);
      this.setDataForNextStep(null);
      throw error; // Re-throw the error after handling fallbacks
    }
    return returnedData;
  }

  private async runRemainingSteps(executedSteps, eventId) {
    for (const step of this.steps) {
      if (!executedSteps.includes(step)) {
        try {
          await (this as any)[step.methodName](eventId, this.forNextData);
          executedSteps.push(step);
        } catch (error) {
          await this.executeFallbacks(executedSteps, eventId);
          console.error(error);
        }
      }
    }
  }

  private async executeFallbacks(executedSteps, eventId) {
    // Execute fallbacks in reverse order
    for (let i = executedSteps.length - 1; i >= 0; i--) {
      const step = executedSteps[i];
      const fallback = this.fallbacks.find((f) => f.order === step.order);
      if (fallback) {
        await (this as any)[fallback.methodName](eventId);
      }
    }
  }

  setDataForNextStep(data) {
    this.forNextData = data;
  }
}
