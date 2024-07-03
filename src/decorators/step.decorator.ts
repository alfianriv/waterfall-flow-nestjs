import 'reflect-metadata';

export const STEP_METADATA_KEY = 'step_order';

export function Step(order: number): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(STEP_METADATA_KEY, order, target, propertyKey);
  };
}