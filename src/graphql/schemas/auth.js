import { gql } from 'apollo-server-express';
import UserService from '../../services/UserService';

export const typeDefs = gql`
  extend type Query {
    me: User
  }

  type AuthResponse {
    accessToken: String!
    refreshToken: String
  }

  type User {
    _id: ID!
    email: String!
  }

  extend type Mutation {
    login(email: String!, password: String!): AuthResponse!
    logout(token: String!): Boolean
    registration(email: String!, password: String!): AuthResponse!
    token(refreshToken: String!): AuthResponse!
  }
`;

export const resolvers = {
  Query: {
    me: async (root, params, context) => {
      const user = await context.getUser();
      return user;
    },
  },

  Mutation: {
    login: async (root, { email, password }) => {
      const { accessToken, refreshToken } = await UserService.loginWithPassword({ email, password });
      return { accessToken, refreshToken };
    },
    logout: (root, { token }) => {
      UserService.logout(token);
      return true;
    },
    registration: async (root, { email, password }) => {
      await UserService.createAccount({ email, password });
      const { accessToken, refreshToken } = await UserService.loginWithPassword({ email, password });
      return { accessToken, refreshToken };
    },
    token: async (root, { token }) => {
      const accessToken = UserService.loginWithRefreshToken(token);
      return { accessToken };
    },
  },
};
