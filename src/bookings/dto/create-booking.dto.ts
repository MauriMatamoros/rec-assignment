import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsFuture } from '../../decorators/is-future.decorator';

export class CreateBookingDto {
  @ApiProperty()
  @IsNumber()
  restaurantTableId: number;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsFuture()
  startDate: Date;

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  guests: number[];
}
