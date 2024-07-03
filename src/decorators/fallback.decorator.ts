import 'reflect-metadata';

export const FALLBACK_STEP_METADATA_KEY = 'fallback_step_order';

export function Fallback(order: number): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(FALLBACK_STEP_METADATA_KEY, order, target, propertyKey);
  };
}