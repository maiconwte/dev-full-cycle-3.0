import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { CategoryEntity } from "../category.entity";

describe("CategoryEntity Unit Tests", () => {
  it("should change name", () => {
    const category = CategoryEntity.create({
      name: "Movie",
    });
    category.changeName("Movie 2");
    expect(category.name).toBe("Movie 2");
  });

  it("should change description", () => {
    const category = CategoryEntity.create({
      name: "Movie",
    });
    category.changeDescription("Movie description 2");
    expect(category.description).toBe("Movie description 2");
  });

  it("should change active", () => {
    const category = CategoryEntity.create({
      name: "Movie",
      is_active: false,
    });
    category.activate();
    expect(category.is_active).toBe(true);
  });

  it("should change deactive", () => {
    const category = CategoryEntity.create({
      name: "Movie",
      is_active: true,
    });
    category.deactivate();
    expect(category.is_active).toBe(false);
  });

  describe("constructor", () => {
    it("should be able to create a category with default values", () => {
      // DDD: Arrange Act Assert
      let category = new CategoryEntity({
        name: "Movie",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });

    it("should be able to create a category with all values", () => {
      const created_at = new Date();
      const category = new CategoryEntity({
        name: "Movie",
        description: "Movie description",
        is_active: false,
        created_at: created_at,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBe(created_at);
    });

    it("should be able to create a category with partial values", () => {
      const category = new CategoryEntity({
        name: "Movie",
        description: null,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe('category_id field', () => {
    const arrange = [{
      category_id: null,
    }, {
      category_id: undefined,
    }, {
      category_id: new Uuid(),
    }];

    test.each(arrange)('should be is %j', ({ category_id }) => {
      const category = new CategoryEntity({
        name: "Movie",
        category_id,
      } as any);
      expect(category.category_id).toBeInstanceOf(Uuid);
    });
  });

  describe("create command", () => {
    it("should be able to create a category", () => {
      const category = CategoryEntity.create({
        name: "Movie",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });
});
