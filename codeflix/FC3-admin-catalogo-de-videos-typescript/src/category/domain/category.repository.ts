import { CategoryEntity } from "./category.entity";

export interface CategoryRepository {
  insert(category: CategoryEntity): Promise<void>;
  find(): Promise<CategoryEntity[]>;
  findById(id: string): Promise<CategoryEntity>;
  update(category: CategoryEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
