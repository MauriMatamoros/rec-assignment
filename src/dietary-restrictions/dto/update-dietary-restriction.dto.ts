import { PartialType } from '@nestjs/swagger';
import { CreateDietaryRestrictionDto } from './create-dietary-restriction.dto';

export class UpdateDietaryRestrictionDto extends PartialType(
  CreateDietaryRestrictionDto,
) {}
