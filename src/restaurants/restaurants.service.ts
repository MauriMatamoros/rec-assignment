import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Restaurant } from './models/restaurant.model';
import { DietaryRestrictionsService } from '../dietary-restrictions/dietary-restrictions.service';
import { DietaryRestriction } from '../dietary-restrictions/models/dietary-restrictions.model';
import { RestaurantTable } from '../restaurant-tables/models/restaurant-table.model';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant)
    private restaurantModel: typeof Restaurant,
    private dietaryRestrictionService: DietaryRestrictionsService,
  ) {}

  private includeEndorsements = {
    model: DietaryRestriction,
    as: 'endorsements',
    through: { attributes: [] },
  };

  private includeTables = {
    model: RestaurantTable,
    as: 'tables',
    required: false,
  };

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.create({
      name: createRestaurantDto.name,
    });

    if (createRestaurantDto.endorsements) {
      for (const endorsement of createRestaurantDto.endorsements) {
        const restriction =
          await this.dietaryRestrictionService.findOrCreate(endorsement);

        await restaurant.$add('endorsement', restriction);
      }
    }

    return this.findOne(restaurant.id);
  }

  findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.findAll({
      include: [this.includeEndorsements, this.includeTables],
    });
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findOne({
      where: { id },
      include: [this.includeEndorsements, this.includeTables],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    return restaurant;
  }

  async update(
    id: number,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    if (updateRestaurantDto.name !== restaurant.name) {
      await restaurant.update({ name: updateRestaurantDto.name });
    }

    if (updateRestaurantDto.endorsements !== undefined) {
      const newEndorsements = await Promise.all(
        updateRestaurantDto.endorsements.map((restriction) =>
          this.dietaryRestrictionService.findOrCreate(restriction),
        ),
      );

      await restaurant.$set('endorsements', newEndorsements);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    await this.restaurantModel.destroy({ where: { id: restaurant.id } });

    return restaurant;
  }
}
