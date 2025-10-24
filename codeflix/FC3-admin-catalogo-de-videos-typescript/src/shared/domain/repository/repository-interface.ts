import { Entity } from "../entity";
import { ValueObject } from '../value-object';

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: E): Promise<void>;
  update(entity: E): Promise<void>;
  delete(id: EntityId): Promise<void>;

  findById(id: EntityId): Promise<E | null>;
  findAll(): Promise<E[]>;
  search(props: any): Promise<E[]>;
  bulkInsert(entities: E[]): Promise<void>;

  getEntity(): new (...args: any[]) => E;
}
