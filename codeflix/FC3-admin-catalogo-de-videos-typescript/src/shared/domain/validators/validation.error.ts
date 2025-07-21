import { FieldsErrors } from './validator-fields-interface';

export class EntityValidationError extends Error {
  constructor(public errors: FieldsErrors, message = "Entity validation error") {
    super(message);
  }

  count(): number {
    return Object.keys(this.errors).length;
  }
}
