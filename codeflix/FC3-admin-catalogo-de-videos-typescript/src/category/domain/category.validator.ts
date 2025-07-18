import { IsString, MaxLength, IsNotEmpty, IsOptional, IsBoolean } from "class-validator";
import { CategoryEntity } from "./category.entity";

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

// export class CategoryValidator extends ClassValidatorFields {
//   validate(notification: Notification, data: any, fields?: string[]): boolean {
//     const newFields = fields?.length ? fields : ["name"];
//     return super.validate(notification, new CategoryRules(data), newFields);
//   }
// }

// export class CategoryValidatorFactory {
//   static create() {
//     return new CategoryValidator();
//   }
// }
