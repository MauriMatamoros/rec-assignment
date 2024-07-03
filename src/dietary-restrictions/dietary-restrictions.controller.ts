import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DietaryRestrictionsService } from './dietary-restrictions.service';
import { CreateDietaryRestrictionDto } from './dto/create-dietary-restriction.dto';
import { UpdateDietaryRestrictionDto } from './dto/update-dietary-restriction.dto';

@ApiTags('dietary restrictions')
@Controller('dietary-restrictions')
export class DietaryRestrictionsController {
  constructor(
    private readonly dietaryRestrictionsService: DietaryRestrictionsService,
  ) {}

  @Post()
  create(@Body() createDietaryRestrictionDto: CreateDietaryRestrictionDto) {
    return this.dietaryRestrictionsService.create(createDietaryRestrictionDto);
  }

  @Get()
  findAll() {
    return this.dietaryRestrictionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dietaryRestrictionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDietaryRestrictionDto: UpdateDietaryRestrictionDto,
  ) {
    return this.dietaryRestrictionsService.update(
      +id,
      updateDietaryRestrictionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dietaryRestrictionsService.remove(+id);
  }
}
