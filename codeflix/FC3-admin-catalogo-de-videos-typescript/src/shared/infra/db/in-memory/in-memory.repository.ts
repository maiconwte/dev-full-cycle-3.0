import { IRepository } from '../../../domain/repository/repository-interface'
import { Entity } from '../../../domain/entity';
import { NotFoundError } from '../../../domain/errors/not-found.error';
import { ValueObject } from '../../../domain/value-object';

export abstract class InMemoryRepository<E extends Entity, EntityId extends ValueObject> implements IRepository<E, EntityId> {
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async update(entity: E): Promise<void> {
    const indexFound = this.items.findIndex(item => item.entity_id.equals(entity.entity_id));
    if (indexFound === -1) {
      throw new NotFoundError(entity.entity_id, this.getEntity());
    }
    this.items[indexFound] = entity;
  }

  async delete(id: EntityId): Promise<void> {
    const indexFound = this.items.findIndex(item => item.entity_id.equals(id));
    if (indexFound === -1) {
      throw new NotFoundError(id, this.getEntity());
    }

    this.items.splice(indexFound, 1);
  }

  async findById(id: EntityId): Promise<E> {
    return this._get(id);
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  protected async _get(entity_id: EntityId) {
    const item = this.items.find(item => item.entity_id.equals(entity_id));

    if (!item) {
      return null
    }

    return item;
  }

  abstract getEntity(): new (...args: any[]) => E;
}
