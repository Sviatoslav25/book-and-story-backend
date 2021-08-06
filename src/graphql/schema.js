import { gql } from 'apollo-server-express';
import { typeDefs as authTypeDefs, resolvers as authResolvers } from './schemas/auth';
import { typeDefs as bookTypeDefs, resolvers as bookResolvers } from './schemas/book';
import { typeDefs as storyTypeDefs, resolvers as storyResolvers } from './schemas/story';
import { typeDefs as profileTypeDefs, resolvers as profileResolvers } from './schemas/profile';
import { typeDefs as subscriptionDefs, resolvers as subscriptionResolvers } from './schemas/subscription';

const rootTypeDefs = gql`
  type Query {
    _empty: Boolean
  }
  type Mutation {
    _empty: Boolean
  }
`;

export const typeDefs = [rootTypeDefs, authTypeDefs, bookTypeDefs, storyTypeDefs, profileTypeDefs, subscriptionDefs];
export const resolvers = [authResolvers, bookResolvers, storyResolvers, profileResolvers, subscriptionResolvers];
