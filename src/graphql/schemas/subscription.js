import { gql } from 'apollo-server-express';
import SubscriptionsService from '../../services/SubscriptionsService';
import isAuthorizedUser from '../isAuthorizedUser';

export const typeDefs = gql`
  #   extend type Query {
  #   }

  extend type Mutation {
    subscribe(authorId: ID!): Boolean!
    unsubscribe(authorId: ID!): Boolean!
  }
`;

export const resolvers = {
  //   Query: {
  //   },

  Mutation: {
    subscribe: async (root, { authorId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await SubscriptionsService.addSubscription({ userId, authorId });
      return true;
    },
    unsubscribe: async (root, { authorId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await SubscriptionsService.removeSubscription({ userId, authorId });
      return true;
    },
  },
};
