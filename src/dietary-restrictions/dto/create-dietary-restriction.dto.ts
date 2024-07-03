import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDietaryRestrictionDto {
  @ApiProperty()
  @IsString()
  name: string;
}
