import { gql } from 'apollo-server-express';
import FavoriteService from '../../services/FavoriteService';
import RatingService from '../../services/RatingService';
import StoryService from '../../services/StoryService';
import UserService from '../../services/UserService';
import isAuthorizedUser from '../isAuthorizedUser';

export const typeDefs = gql`
  type Story {
    _id: ID!
    name: String!
    authorId: ID!
    author: User!
    genre: String!
    shortDescription: String!
    story: String!
    rating: Float!
    createAt: Float!
    updateAt: Float!
    userCanAddRating: Boolean!
    isPrivate: Boolean!
    isFavorite: Boolean
  }

  input StoryCreateInput {
    name: String!
    genre: String!
    shortDescription: String!
    story: String!
    isPrivate: Boolean!
  }

  input StoryUpdateInput {
    name: String
    genre: String
    shortDescription: String
    story: String
    isPrivate: Boolean
  }

  extend type Query {
    stories: [Story]!
    story(id: ID!): Story!
    storiesSearch(searchString: String!): [Story]!
    myStories: [Story]!
    favoritesStories: [Story]!
  }

  extend type Mutation {
    createStory(input: StoryCreateInput!): Story!
    addRatingForStory(storyId: ID!, rating: Int!): Story!
    deleteStory(storyId: ID!): Boolean!
    updateStory(input: StoryUpdateInput!, storyId: ID!): Story!
    changePrivacyOfStory(storyId: ID!, isPrivate: Boolean!): Story!
    addStoryToFavorites(storyId: ID!): Boolean!
    removeStoryFromFavorites(storyId: ID!): Boolean!
  }
`;

const safeFindStory = async (storyId, userId) => {
  const story = await StoryService.getStoryById(storyId);
  if (!story) {
    throw new Error('Story not found');
  }
  const canViewStory = StoryService.canViewStory(story, userId);
  if (!canViewStory) {
    throw new Error('Access denied');
  }
  return story;
};

export const resolvers = {
  Query: {
    stories: async (root, params, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const stories = await StoryService.getStories(userId);
      return stories;
    },
    story: async (root, { id }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const story = await StoryService.getStoryById(id, userId);
      return story;
    },
    storiesSearch: async (root, { searchString }, context) => {
      isAuthorizedUser(context);
      const stories = await StoryService.searchStory(searchString);
      return stories;
    },
    myStories: async (root, params, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const stories = await StoryService.getMyStories({ userId });
      return stories;
    },
    favoritesStories: async (root, params, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const favoritesStories = await StoryService.getFavoritesStories(userId);
      return favoritesStories;
    },
  },

  Mutation: {
    createStory: async (root, { input }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const story = await StoryService.createStory(input, userId);
      return story;
    },
    addRatingForStory: async (root, { storyId, rating }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await RatingService.addRatingForStories({ storyId, rating, userId });
      const story = StoryService.getStoryById(storyId);
      return story;
    },
    deleteStory: async (root, { storyId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await safeFindStory(storyId, userId);
      await StoryService.deleteStory({ storyId, userId });
      return true;
    },
    updateStory: async (root, { input, storyId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await StoryService.updateStory(storyId, input, { userId });
      const story = StoryService.getStoryById(storyId);
      return story;
    },
    changePrivacyOfStory: async (root, { storyId, isPrivate }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await safeFindStory(storyId, userId);
      await StoryService.changePrivacyOfStory({ storyId, isPrivate, authorId: userId });
      const story = await StoryService.getStoryById(storyId);
      return story;
    },
    addStoryToFavorites: async (root, { storyId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await FavoriteService.addStoryToFavorites({ storyId, userId });
      return true;
    },
    removeStoryFromFavorites: async (root, { storyId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await FavoriteService.removeStoryFromFavorites({ storyId, userId });
      return true;
    },
  },
  Story: {
    author: async (root) => {
      const user = await UserService.findById(root.authorId);
      return user;
    },
  },
};
