import { Entity } from "../../../../domain/entity";
import { NotFoundError } from "../../../../domain/errors/not-found.error";
import { Uuid } from "../../../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "../in-memory.repository";

type StubEntityProps = {
  entity_id?: Uuid;
  name: string;
  price: number;
}

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityProps) {
    super();
    this.entity_id = props.entity_id ?? new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON(): any {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    }
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it('should be defined', () => {
    expect(InMemoryRepository).toBeDefined();
  });

  it('should throw error when entity is not found', async () => {
    const entity = new StubEntity({
      name: 'Entity 1',
      price: 100
    });
    await expect(() => repository.update(entity)).rejects.toThrow(new NotFoundError(entity.entity_id, StubEntity));
  });

  describe('insert', () => {
    it('should insert a new entity', async () => {
      const entity = new StubEntity({
        entity_id: new Uuid(),
        name: 'Entity 1',
        price: 100
      });
      await repository.insert(entity);

      expect(repository.items.length).toBe(1);
    });

    it('should insert bulk entities', async () => {
      const entities = [
        new StubEntity({
          entity_id: new Uuid(),
          name: 'Entity 1',
          price: 100
        }),
        new StubEntity({
          entity_id: new Uuid(),
          name: 'Entity 2',
          price: 100
        }),
      ];
      await repository.bulkInsert(entities);
      expect(repository.items.length).toBe(2);
      expect(repository.items[0]).toStrictEqual(entities[0]);
      expect(repository.items[1]).toStrictEqual(entities[1]);
    });
  });

  describe('update', () => {
    it('should update a entity', async () => {
      const entity = new StubEntity({
        entity_id: new Uuid(),
        name: 'Entity 1',
        price: 100
      });

      await repository.insert(entity);

      const entityUpdated = new StubEntity({
        entity_id: entity.entity_id,
        name: 'Entity Updated',
        price: 100
      });

      await repository.update(entityUpdated);

      expect(entityUpdated.toJSON()).toStrictEqual(entityUpdated.toJSON());
    });
  });

  describe('delete', () => {
    it('should delete a entity', async () => {
      const entity = new StubEntity({
        entity_id: new Uuid(),
        name: 'Entity 1',
        price: 100
      });

      await repository.insert(entity);

      await repository.delete(entity.entity_id);

      expect(repository.items.length).toBe(0);
    });
  });

  describe('findById', () => {
    it('should return a entity', async () => {
      const entity = new StubEntity({
        entity_id: new Uuid(),
        name: 'Entity 1',
        price: 100
      });

      await repository.insert(entity);

      expect(await repository.findById(entity.entity_id)).toStrictEqual(entity);
    });
  });

  describe('findAll', () => {
    it('should return all entities', async () => {
      const entities = [
        new StubEntity({
          entity_id: new Uuid(),
          name: 'Entity 1',
          price: 100
        }),
      ];
      await repository.bulkInsert(entities);
      expect(await repository.findAll()).toStrictEqual(entities);
    });
  });
});
