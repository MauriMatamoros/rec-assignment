import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DietaryRestriction } from './models/dietary-restrictions.model';

@Injectable()
export class DietaryRestrictionsService {
  constructor(
    @InjectModel(DietaryRestriction)
    private dietaryRestrictionModel: typeof DietaryRestriction,
  ) {}

  async create(dietaryRestriction: string): Promise<DietaryRestriction> {
    const [restriction] = await this.dietaryRestrictionModel.findOrCreate({
      where: {
        name: dietaryRestriction,
      },
    });
    return restriction;
  }
}
