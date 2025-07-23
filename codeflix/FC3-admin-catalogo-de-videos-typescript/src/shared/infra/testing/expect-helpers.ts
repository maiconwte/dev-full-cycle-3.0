import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { FieldsErrors } from "../../domain/validators/validator-fields-interface";
import { EntityValidationError } from "../../domain/validators/validation.error";

type Expected =
  | {
    validator: ClassValidatorFields<any>;
    data: any;
  }
  | (() => any);

function isValid() {
  return {
    message: () => "",
    pass: true,
  };
}

function assetContainsErrorsMessages(
  expected: FieldsErrors,
  received: FieldsErrors
) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);

  return isMatch
    ? isValid()
    : {
      message: () =>
        `The validation errors doesn't contain ${JSON.stringify(
          received
        )}. Current: ${JSON.stringify(expected)}`,
      pass: false,
    };
}

expect.extend({
  toContainErrorMessages(expected: Expected, received: FieldsErrors) {
    if (typeof expected === "function") {
      try {
        expected();
        return isValid();
      } catch (e) {
        const error = e as EntityValidationError;
        return assetContainsErrorsMessages(error.errors, received);
      }
    } else {
      const { validator, data } = expected;
      const validated = validator.validate(data);

      if (validated) {
        return isValid();
      }

      return assetContainsErrorsMessages(validator.errors, received);
    }
  },
});
