import 'reflect-metadata';

export const ROLLBACK_STEP_METADATA_KEY = 'rollback_step_order';

export function Rollback(order: number): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(ROLLBACK_STEP_METADATA_KEY, order, target, propertyKey);
  };
}