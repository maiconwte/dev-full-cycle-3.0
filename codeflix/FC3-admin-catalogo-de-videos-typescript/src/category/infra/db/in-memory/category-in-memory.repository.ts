import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { CategoryEntity } from '../../../domain/category.entity';
import {
  CategoryFilter,
  ICategoryRepository,
} from '../../../domain/category.repository';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<CategoryEntity, Uuid>
  implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at'];

  protected async applyFilter(
    items: CategoryEntity[],
    filter: CategoryFilter | null,
  ): Promise<CategoryEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.name.toLowerCase().includes(filter.toLowerCase());
    });
  }
  getEntity(): new (...args: any[]) => CategoryEntity {
    return CategoryEntity;
  }

  protected applySort(
    items: CategoryEntity[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc');
  }
}
