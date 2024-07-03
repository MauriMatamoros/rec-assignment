import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { DietaryRestrictionsService } from '../dietary-restrictions/dietary-restrictions.service';
import { DietaryRestriction } from '../dietary-restrictions/models/dietary-restrictions.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private dietaryRestrictionService: DietaryRestrictionsService,
  ) {}

  private includeDietaryRestrictions = {
    model: DietaryRestriction,
    as: 'dietaryRestrictions',
    through: { attributes: [] },
  };

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModel.create({ name: createUserDto.name });

    for (const dietaryRestriction of createUserDto.dietaryRestrictions) {
      const restriction =
        await this.dietaryRestrictionService.findOrCreate(dietaryRestriction);

      await user.$add('dietaryRestriction', restriction);
    }

    return this.findOne(user.id);
  }

  findAll(): Promise<User[]> {
    return this.userModel.findAll({ include: this.includeDietaryRestrictions });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findOne({
      where: { id },
      include: this.includeDietaryRestrictions,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.name !== user.name) {
      await user.update({ name: updateUserDto.name });
    }

    if (updateUserDto.dietaryRestrictions !== undefined) {
      const newRestrictions = await Promise.all(
        updateUserDto.dietaryRestrictions.map((restriction) =>
          this.dietaryRestrictionService.findOrCreate(restriction),
        ),
      );

      await user.$set('dietaryRestrictions', newRestrictions);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);

    await this.userModel.destroy({ where: { id } });

    return user;
  }
}
