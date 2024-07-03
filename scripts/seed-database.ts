import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { Restaurant } from '../src/restaurants/models/restaurant.model';
import { User } from '../src/users/models/user.model';
import { DietaryRestriction } from '../src/dietary-restrictions/models/dietary-restrictions.model';
import { RestaurantTable } from '../src/restaurant-tables/models/restaurant-table.model';
import { UserDietaryRestrictions } from '../src/user-dietary-restrictions/models/user-dietary-restrictions.model';
import { Endorsement } from '../src/endorsements/models/endorsement.model';
import * as dotenv from 'dotenv';

dotenv.config();

const sequelizeOptions: SequelizeOptions = {
  dialect: 'postgres',
  host: 'localhost',
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  models: [
    User,
    Restaurant,
    DietaryRestriction,
    RestaurantTable,
    UserDietaryRestrictions,
    Endorsement,
  ],
};

const sequelize = new Sequelize(sequelizeOptions);

const data = {
  restaurants: [
    {
      name: 'Restaurant One',
      endorsements: ['vegetarian', 'vegan'],
    },
    {
      name: 'Restaurant Two',
      endorsements: ['gluten free', 'dairy free'],
    },
    {
      name: 'Restaurant Three',
      endorsements: ['nut free', 'kosher'],
    },
    {
      name: 'Restaurant Four',
      endorsements: ['halal', 'vegan'],
    },
    {
      name: 'Restaurant Five',
      endorsements: ['vegetarian', 'gluten free'],
    },
  ],
  users: [
    {
      name: 'User One',
      dietaryRestrictions: ['vegetarian', 'vegan'],
    },
    {
      name: 'User Two',
      dietaryRestrictions: ['gluten free', 'dairy free'],
    },
    {
      name: 'User Three',
      dietaryRestrictions: ['nut free', 'kosher'],
    },
    {
      name: 'User Four',
      dietaryRestrictions: ['halal', 'vegan'],
    },
    {
      name: 'User Five',
      dietaryRestrictions: ['vegetarian', 'gluten free'],
    },
  ],
  tables: [
    {
      capacity: 2,
    },
    {
      capacity: 4,
    },
  ],
};

const URI = 'http://localhost:3000';

async function seedData() {
  await Promise.all([
    User.destroy({ where: {}, force: true }),
    Restaurant.destroy({ where: {}, force: true }),
    DietaryRestriction.destroy({ where: {}, force: true }),
    RestaurantTable.destroy({ where: {}, force: true }),
    UserDietaryRestrictions.destroy({ where: {}, force: true }),
    Endorsement.destroy({ where: {}, force: true }),
  ]);

  for (const restaurant of data.restaurants) {
    const restaurantResponse = await fetch(`${URI}/restaurants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurant),
    });

    if (!restaurantResponse.ok) {
      const message = `An error has occured: ${restaurantResponse.status}`;
      throw new Error(message);
    }

    const result = await restaurantResponse.json();

    for (const table of data.tables) {
      await fetch(`${URI}/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          capacity: table.capacity,
          restaurantId: result.id,
        }),
      });
    }
  }

  for (const user of data.users) {
    const userResponse = await fetch(`${URI}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (!userResponse.ok) {
      const message = `An error has occurred: ${userResponse.status}`;
      throw new Error(message);
    }
  }
}

seedData()
  .then(() => {
    console.log('Data seeding completed!');
  })
  .catch((error) => {
    console.log('Error seeding data: ', error);
  });
