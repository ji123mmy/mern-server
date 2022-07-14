import { gql } from "apollo-server-express";

const userMutation = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
    token: String!
  }
  input registerInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  input loginInput {
    username: String!
    password: String!
  }

  extend type Mutation {
    register(registerInput: registerInput): User!
    login(loginInput: loginInput): User!
  }
`;

export default userMutation;