import { InMemoryRepository } from '../../../shared/infra/db/in-memory/in-memory.repository';
import { CategoryEntity } from '../../domain/category.entity';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';

export class CategoryInMemoryRepository extends InMemoryRepository<CategoryEntity, Uuid> {
  getEntity(): new (...args: any[]) => CategoryEntity {
    return CategoryEntity;
  }
}
