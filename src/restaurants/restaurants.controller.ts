import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { RestaurantFilterDto } from './dto/filter-restaurant.dto';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  @ApiQuery({ name: 'users', required: false, type: 'number', isArray: true })
  @ApiQuery({ name: 'user', required: false, type: 'number' })
  @ApiQuery({ name: 'date', required: false, type: String })
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() filters: RestaurantFilterDto) {
    const allowedKeys = ['user', 'users', 'date'];
    const objectKeys = Object.keys(filters);
    if (
      objectKeys.every((key) => allowedKeys.includes(key)) &&
      Object.keys(filters).length > 0
    ) {
      return this.restaurantsService.findAvailable(filters);
    }
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(+id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(+id);
  }
}
