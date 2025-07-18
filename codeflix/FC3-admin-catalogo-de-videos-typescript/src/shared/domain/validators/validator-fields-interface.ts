export type FieldsErrors =
  | {
    [field: string]: string[];
  }

export interface IValidatorFields<PropsValidated> {
  errors: FieldsErrors;
  validatedData: PropsValidated;
  validate(data: any): boolean;
}
