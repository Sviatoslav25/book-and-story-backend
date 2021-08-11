import { gql } from 'apollo-server-express';
import BookService from '../../services/BookService';
import ProfileService from '../../services/ProfileService';
import StoryService from '../../services/StoryService';
import isAuthorizedUser from '../isAuthorizedUser';

export const typeDefs = gql`
  type Profile {
    _id: ID!
    userId: ID!
    nickname: String!
    profilePhoto: String!
    fullName: String!
    email: String!
    phoneNumber: String!
    aboutMyself: String!
    isFollowed: Boolean!
  }

  input ProfileUpdateInput {
    nickname: String
    profilePhoto: String
    fullName: String
    email: String
    phoneNumber: String
    aboutMyself: String
  }

  extend type Query {
    profiles: [Profile]!
    profile(profileId: ID!): Profile!
    myProfile: Profile!
    userBooks(userId: ID!): [Book]!
    userStories(userId: ID!): [Story]!
  }

  extend type Mutation {
    updateProfile(input: ProfileUpdateInput!): Profile!
  }
`;

export const resolvers = {
  Query: {
    profiles: async (root, params, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const profileList = await ProfileService.getProfileList(userId);
      return profileList;
    },
    profile: async (root, { profileId }, context) => {
      isAuthorizedUser(context);
      const profile = await ProfileService.getProfileById(profileId);
      return profile;
    },
    myProfile: async (root, params, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const profile = await ProfileService.getProfileByUserId(userId);
      return profile;
    },
    userBooks: async (root, { userId }, context) => {
      isAuthorizedUser(context);
      const userBooks = await BookService.getBooksByUserId(userId);
      return userBooks;
    },

    userStories: async (root, { userId }, context) => {
      isAuthorizedUser(context);
      const userStories = await StoryService.getStoriesByUserId(userId);
      return userStories;
    },
  },

  Mutation: {
    updateProfile: async (root, { input }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await ProfileService.updateProfile({ userId, data: input });
      const profile = await ProfileService.getProfileByUserId(userId);
      return profile;
    },
  },
};
