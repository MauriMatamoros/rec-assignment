import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DietaryRestriction } from './models/dietary-restrictions.model';
import { CreateDietaryRestrictionDto } from './dto/create-dietary-restriction.dto';
import { UniqueConstraintError } from 'sequelize';
import { UpdateDietaryRestrictionDto } from './dto/update-dietary-restriction.dto';

@Injectable()
export class DietaryRestrictionsService {
  constructor(
    @InjectModel(DietaryRestriction)
    private dietaryRestrictionModel: typeof DietaryRestriction,
  ) {}

  async create(
    createDietaryRestrictionDto: CreateDietaryRestrictionDto,
  ): Promise<DietaryRestriction> {
    let restriction: DietaryRestriction;
    try {
      restriction = await this.dietaryRestrictionModel.create({
        name: createDietaryRestrictionDto.name,
      });
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new ConflictException(
          `Dietary Restriction with name ${createDietaryRestrictionDto.name} already exists.`,
        );
      }
    }
    return restriction;
  }

  async findOrCreate(dietaryRestriction: string): Promise<DietaryRestriction> {
    const [restriction] = await this.dietaryRestrictionModel.findOrCreate({
      where: {
        name: dietaryRestriction,
      },
    });
    return restriction;
  }

  async findAll(): Promise<DietaryRestriction[]> {
    return this.dietaryRestrictionModel.findAll();
  }

  async findOne(id: number): Promise<DietaryRestriction> {
    const restriction = await this.dietaryRestrictionModel.findOne({
      where: { id },
    });

    if (!restriction) {
      throw new NotFoundException(
        `Dietary Restriction with id ${id} not found`,
      );
    }

    return restriction;
  }

  async remove(id: number): Promise<DietaryRestriction> {
    const restriction = await this.findOne(id);

    await this.dietaryRestrictionModel.destroy({
      where: { id: restriction.id },
    });

    return restriction;
  }

  async update(
    id: number,
    updateDietaryRestrictionDto: UpdateDietaryRestrictionDto,
  ): Promise<DietaryRestriction> {
    const restriction = await this.findOne(id);
    await restriction.update({ name: updateDietaryRestrictionDto.name });
    return restriction;
  }
}
