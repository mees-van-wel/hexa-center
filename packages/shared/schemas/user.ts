import {
  email,
  minLength,
  nullable,
  nullish,
  number,
  object,
  optional,
  string,
} from "valibot";

export const UserCreateSchema = object({
  // propertyId: number(),
  // roleId: number(),
  firstName: string([minLength(2)]),
  lastName: string([minLength(2)]),
  email: nullable(string([email()])),
  // TODO Phone number validation pipe
  phoneNumber: nullable(string()),
  dateOfBirth: nullable(string()),
  // TODO sex picklist
  sex: nullable(string()),
  street: nullable(string()),
  houseNumber: nullable(string()),
  postalCode: nullable(string()),
  city: nullable(string()),
  region: nullable(string()),
  // TODO country picklist
  country: nullable(string()),
});

export const UserUpdateSchema = object({
  id: number(),
  // propertyId: optional(number()),
  // roleId: optional(number()),
  firstName: optional(string([minLength(2)])),
  lastName: optional(string([minLength(2)])),
  email: nullish(string([email()])),
  // TODO Phone number validation pipe
  phoneNumber: nullish(string()),
  dateOfBirth: nullish(string()),
  // TODO sex picklist
  sex: nullish(string()),
  street: nullish(string()),
  houseNumber: nullish(string()),
  postalCode: nullish(string()),
  city: nullish(string()),
  region: nullish(string()),
  // TODO country picklist
  country: nullish(string()),
});
