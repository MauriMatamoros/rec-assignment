import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsFuture } from '../../decorators/is-future.decorator';

@ValidatorConstraint({ async: false })
class UsersAndUserValidator implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    const obj = args.object as RestaurantFilterDto;
    return !(obj.users && obj.user);
  }

  defaultMessage() {
    return "You can't send 'user' and 'users' parameters together.";
  }
}

@ValidatorConstraint({ async: false })
export class CustomDatesAndUsersValidator
  implements ValidatorConstraintInterface
{
  validate(propertyValue: any, args: ValidationArguments) {
    const { object } = args;
    const userProvided = 'user' in object && object['user'] != null;
    const usersProvided =
      'users' in object &&
      Array.isArray(object['users']) &&
      object['users'].length > 0;
    const dateProvided = 'date' in object && object['date'] != null;
    if (dateProvided) {
      return userProvided != usersProvided;
    } else {
      return !userProvided && !usersProvided && !dateProvided;
    }
  }

  defaultMessage() {
    return 'Either date and (user or users) are provided, or none of them is provided.';
  }
}

export class RestaurantFilterDto {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsFuture()
  date?: Date;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayUnique()
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  users?: number[];

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  user?: number;

  @Validate(UsersAndUserValidator)
  user_and_users_validation: unknown;

  @Validate(CustomDatesAndUsersValidator)
  date_user_users_validation: unknown;
}
