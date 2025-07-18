import { IsString, MaxLength, IsNotEmpty, IsOptional, IsBoolean } from "class-validator";
import { CategoryEntity } from "./category.entity";
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';

export class CategoryRules {
  @MaxLength(255, { groups: ["name"] })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;

  constructor(entity: CategoryEntity) {
    Object.assign(this, entity);
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(category: CategoryEntity): boolean {
    return super.validate(new CategoryRules(category));
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
