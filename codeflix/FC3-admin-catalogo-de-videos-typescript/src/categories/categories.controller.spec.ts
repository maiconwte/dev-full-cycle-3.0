import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          logging: true,
          models: [CategoryModel],
          autoLoadModels: true,
          synchronize: true,
        }),
        SequelizeModule.forFeature([CategoryModel]),
      ],
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategorySequelizeRepository,
          useFactory: (categoryModel: typeof CategoryModel) => {
            return new CategorySequelizeRepository(categoryModel);
          },
          inject: [getModelToken(CategoryModel)],
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    console.log('controller', controller);
    expect(controller).toBeDefined();
  });
});
