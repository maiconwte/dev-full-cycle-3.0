import { IRepository } from "../../shared/domain/repository/repository-interface";
import { CategoryEntity } from "./category.entity";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";

export type CategoryFilter = string;

export interface ICategoryRepository
  extends IRepository<CategoryEntity, Uuid> { }
