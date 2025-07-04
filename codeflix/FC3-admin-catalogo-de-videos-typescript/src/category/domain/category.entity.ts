import { Uuid } from "../../shared/domain/value-objects/uuid.vo";

export type CategoryConstructorProps = {
  category_id?: Uuid;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
}

export type CategoryCreateCommand = {
  name: string;
  description?: string;
  is_active?: boolean;
}

/**
 * Category entity
 * @description This entity represents a category of a product
 */
export class CategoryEntity {
  category_id: Uuid;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;

  constructor(props: CategoryConstructorProps) {
    this.category_id = props.category_id ?? new Uuid();
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  /**
   * Create category @Factory
   * @param props - The properties of the category
   * @returns A new category entity
   */
  static create(props: CategoryCreateCommand): CategoryEntity {
    return new CategoryEntity(props);
  }

  /**
   * Change the name of the category
   * @param name - The new name of the category
   */
  changeName(name: string): void {
    this.name = name;
  }

  /**
   * Change the description of the category
   * @param description - The new description of the category
   */
  changeDescription(description: string): void {
    this.description = description;
  }

  /**
   * Activate the category
   */
  activate(): void {
    this.is_active = true;
  }

  /**
   * Deactivate the category
   */
  deactivate(): void {
    this.is_active = false;
  }

  /**
   * Convert the category to a JSON object
   * @returns A JSON object representing the category
   */
  toJSON() {
    return {
      category_id: this.category_id.id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
