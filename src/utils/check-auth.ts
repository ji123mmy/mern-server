import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-express";
import { Iuser } from "../schema/resolvers/users";

const checkAuth = (context) => {
  const token = context.req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    throw new Error("Authorization header not found");
  }
  try {
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    return user;
  } catch (err) {
    throw new AuthenticationError("Invalid/Expired token");
  }
};

export default checkAuth;
