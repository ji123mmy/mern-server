import { IregisterInput, IloginInput } from "schema/resolvers/users";

interface registerInputError {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  [key: string]: string | undefined;
}

interface output {
  errors: registerInputError;
  valid: boolean;
}

export const validateRegistorInput = (data: IregisterInput): output => {
  const errors: registerInputError = {};
  const { email, password, confirmPassword } = data;

  Object.entries(data).forEach(([key, value]: [string, string]) => {
    if (value.trim() === "") {
      errors[key] = `${key} is required`;
    }
  });

  if (
    !errors.email &&
    !email.match(
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    )
  ) {
    errors.email = "Email is invalid";
  }

  if (!errors.password && password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors: errors,
    valid: Object.keys(errors).length === 0,
  };
};

export const validateLoginInput = (data: IloginInput): output => {
  const errors: registerInputError = {};

  Object.entries(data).forEach(([key, value]: [string, string]) => {
    if (value.trim() === "") {
      errors[key] = `${key} is required`;
    }
  });
  return {
    errors: errors,
    valid: Object.keys(errors).length === 0,
  };
}
