import { EntityValidationError } from "../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { CategoryEntity } from "../category.entity";

describe("CategoryEntity Unit Tests", () => {
  let validateSpy: jest.SpyInstance;

  beforeEach(() => {
    validateSpy = jest.spyOn(CategoryEntity, "validate");
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

  it("should change name", () => {
    const category = CategoryEntity.create({
      name: "Movie",
    });
    category.changeName("Movie 2");
    expect(category.name).toBe("Movie 2");
    expect(validateSpy).toHaveBeenCalledWith(category);
  });

  it("should change description", () => {
    const category = CategoryEntity.create({
      name: "Movie",
    });
    category.changeDescription("Movie description 2");
    expect(category.description).toBe("Movie description 2");
    expect(validateSpy).toHaveBeenCalledWith(category);
  });

  it("should change active", () => {
    const category = CategoryEntity.create({
      name: "Movie",
      is_active: false,
    });
    category.activate();
    expect(category.is_active).toBe(true);
    expect(validateSpy).toHaveBeenCalledWith(category);
  });

  it("should change deactive", () => {
    const category = CategoryEntity.create({
      name: "Movie",
      is_active: true,
    });
    category.deactivate();
    expect(category.is_active).toBe(false);
    expect(validateSpy).toHaveBeenCalledWith(category);
  });

  describe("category_id field", () => {
    const arrange = [
      {
        category_id: null,
      },
      {
        category_id: undefined,
      },
      {
        category_id: new Uuid(),
      },
    ];

    test.each(arrange)("should be is %j", ({ category_id }) => {
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
      expect(validateSpy).toHaveBeenCalledWith(category);
    });
  });
});

describe("Category Validator", () => {
  describe("create command", () => {
    test("should and invalid category with name property", () => {
      expect(() =>
        CategoryEntity.create({
          name: null,
        })
      ).toContainErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
      expect(() =>
        CategoryEntity.create({
          name: "",
        })
      ).toContainErrorMessages({
        name: ["name should not be empty"],
      });
      expect(() =>
        CategoryEntity.create({
          name: 5 as any,
        })
      ).toContainErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
      expect(() =>
        CategoryEntity.create({
          name: "t".repeat(256),
        })
      ).toContainErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    test("should a invalid category with description property", () => {
      expect(() =>
        CategoryEntity.create({
          name: "Movie",
          description: 5 as any,
        })
      ).toContainErrorMessages({
        description: ["description must be a string"],
      });
      expect(() =>
        CategoryEntity.create({
          name: "Movie",
          description: "t".repeat(256),
        })
      ).toContainErrorMessages({
        description: [
          "description must be shorter than or equal to 255 characters",
        ],
      });
    });

    test("should a invalid category with is_active property", () => {
      expect(() =>
        CategoryEntity.create({
          name: "Movie",
          is_active: 5 as any,
        })
      ).toContainErrorMessages({
        is_active: ["is_active must be a boolean value"],
      });
    });
  });

  describe("change name", () => {
    test("should a invalid category with name property", () => {
      const category = CategoryEntity.create({
        name: "Movie",
      });
      expect(() => category.changeName(null)).toContainErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    });
  });
});
