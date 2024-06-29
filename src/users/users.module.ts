import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { DietaryRestrictionsModule } from '../dietary-restrictions/dietary-restrictions.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), DietaryRestrictionsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
