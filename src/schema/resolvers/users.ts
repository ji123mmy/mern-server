import { UserInputError } from "apollo-server-express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  validateRegistorInput,
  validateLoginInput,
} from "./../../utils/validators";
import { User } from "../../models";

interface Icontext {
  registerInput: IregisterInput;
  loginInput: IloginInput;
}

export interface IregisterInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IloginInput {
  username: string;
  password: string;
}

export interface Iuser {
  id?: string;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
}

const generateToken = (user: Iuser) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
};

const register = async (_: unknown, { registerInput }: Icontext) => {
  const { username, email, password } = registerInput;
  const { valid, errors } = validateRegistorInput(registerInput);

  if (!valid) {
    throw new UserInputError("Invalid input", { errors });
  }

  const exsistUser = await User.findOne({ username });
  if (exsistUser) {
    throw new UserInputError("User already exists", {
      errors: {
        username: "This username is already taken",
      },
    });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser: Iuser = await User.create({
      username,
      email,
      password: hashPassword,
      createdAt: new Date().toISOString(),
    });

    const token = generateToken(newUser);

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
      token,
    };
  } catch (err) {
    throw new Error(err as string);
  }
};

const login = async (_: unknown, { loginInput }: Icontext) => {
  const { username, password } = loginInput;
  const { valid, errors } = validateLoginInput(loginInput);

  if (!valid) {
    throw new UserInputError("Invalid input", { errors });
  }

  const user: Iuser | null = await User.findOne({ username });
  if (!user) {
    errors.general = "User not found";
    throw new UserInputError("Wrong credentials", {
      errors,
    });
  }

  try {
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      errors.general = "Wrong credentials";
      throw new UserInputError("Wrong credentials", {
        errors,
      });
    }

    const token = generateToken(user);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      token,
    };
  } catch (err) {
    throw new Error(err as string);
  }
};

export const userMutations = {
  register,
  login,
};
