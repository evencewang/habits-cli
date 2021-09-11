import { BaseSchema } from "yup";

/**
 * Construct a validator function that takes a value and returns `true`
 * on validation successes, and a string stating the error on validation
 * failures.
 * @param schema Validation schema for this value. Construct this schema
 * using `vschema` exported from the `service` folder.
 */
const construct = (schema: BaseSchema) => {
  return async (value: any) => {
    try {
      await schema.validate(value);
      return true;
    } catch (error: any) {
      return error.message;
    }
  };
};

export const validator = { construct };
