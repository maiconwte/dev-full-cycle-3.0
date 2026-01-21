import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([CategoryModel])],
  controllers: [CategoriesController],
  // providers: [],
})
export class CategoriesModule {}
