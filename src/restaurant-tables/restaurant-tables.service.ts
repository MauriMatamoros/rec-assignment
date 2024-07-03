import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import { InjectModel } from '@nestjs/sequelize';
import { RestaurantTable } from './models/restaurant-table.model';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class RestaurantTablesService {
  constructor(
    @InjectModel(RestaurantTable)
    private restaurantTableModel: typeof RestaurantTable,
    private restaurantsService: RestaurantsService,
  ) {}

  async create(
    createTableDto: CreateRestaurantTableDto,
  ): Promise<RestaurantTable> {
    await this.restaurantsService.findOne(createTableDto.restaurantId);

    return this.restaurantTableModel.create({ ...createTableDto });
  }

  findAll(): Promise<RestaurantTable[]> {
    return this.restaurantTableModel.findAll();
  }

  async findOne(id: number): Promise<RestaurantTable> {
    const table = await this.restaurantTableModel.findOne({ where: { id } });

    if (!table) {
      throw new NotFoundException(`Restaurant Table with id ${id} not found`);
    }

    return table;
  }

  async update(
    id: number,
    updateTableDto: UpdateRestaurantTableDto,
  ): Promise<RestaurantTable> {
    const table = await this.findOne(id);

    if (updateTableDto.restaurantId) {
      await this.restaurantsService.findOne(updateTableDto.restaurantId);
    }

    await table.update({ ...updateTableDto });

    return this.findOne(id);
  }

  async remove(id: number): Promise<RestaurantTable> {
    const table = await this.findOne(id);

    await this.restaurantTableModel.destroy({ where: { id } });

    return table;
  }
}
