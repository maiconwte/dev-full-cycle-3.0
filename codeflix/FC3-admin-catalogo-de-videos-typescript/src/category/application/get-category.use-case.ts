import { IUseCase } from '../../shared/application/use-case.interface';
import { NotFoundError } from '../../shared/domain/errors/not-found.error';
import { Category, CategoryId } from '../domain/category.aggregate';
import { ICategoryRepository } from '../domain/category.repository';
// import {
//   CategoryOutput,
//   CategoryOutputMapper,
// } from './category-output';

export class GetCategoryUseCase
  implements IUseCase<GetCategoryInput, GetCategoryOutput> {
  constructor(private categoryRepo: ICategoryRepository) { }

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const categoryId = new CategoryId(input.id);
    const category = await this.categoryRepo.findById(categoryId);

    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    return {
      id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    }
  }
}

export type GetCategoryInput = {
  id: string;
};

export type GetCategoryOutput = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
};
