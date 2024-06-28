import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  dietaryRestrictions: string[];
}
