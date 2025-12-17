import { Entity } from "../entity";
import { ValueObject } from '../value-object';
import { SearchParams } from './search-params';
import { SearchResult } from './search-result';

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: E): Promise<void>;
  update(entity: E): Promise<void>;
  delete(id: EntityId): Promise<void>;

  findById(id: EntityId): Promise<E | null>;
  findAll(): Promise<E[]>;
  // search(props: any): Promise<E[]>;
  bulkInsert(entities: E[]): Promise<void>;

  getEntity(): new (...args: any[]) => E;
}

export interface ISearchableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  SearchInput = SearchParams,
  SearchOutput = SearchResult,
> extends IRepository<E, EntityId> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
