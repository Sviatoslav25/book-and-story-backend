import { gql } from 'apollo-server-express';
import ProfileService from '../../services/ProfileService';
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
