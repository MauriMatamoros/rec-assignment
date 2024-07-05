import { registerDecorator, ValidationOptions } from 'class-validator';
import { isFuture } from 'date-fns';

export function IsFuture(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: Date) => {
          return isFuture(value); // for checking the date is in the future
        },
        defaultMessage: () => 'Start date should be in the future',
      },
    });
  };
}
