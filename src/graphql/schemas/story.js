import { gql } from 'apollo-server-express';
import RatingService from '../../services/RatingService';
import StoryService from '../../services/StoryService';

export const typeDefs = gql`
  type Story {
    _id: ID!
    name: String!
    date: Float!
    authorId: ID!
    genre: String!
    shortDescription: String!
    story: String!
    rating: Float!
    createAt: Float!
    updateAt: Float!
  }

  input StoryCreateInput {
    name: String!
    date: Float!
    genre: String!
    shortDescription: String!
    story: String!
  }

  input StoryUpdateInput {
    name: String
    date: Float
    genre: String
    shortDescription: String
    story: String
  }

  extend type Query {
    stories: [Story]!
    story(id: ID!): Story!
    storiesSearch(searchString: String!): [Story]!
    myStories: [Story]!
  }

  extend type Mutation {
    createStory(input: StoryCreateInput): Story!
    addRatingForStory(storyId: ID!, rating: Int!): Story!
    deleteStory(storyId: ID!): Boolean!
    updateStory(input: StoryUpdateInput, storyId: ID!): Story!
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
    stories: async () => {
      const stories = await StoryService.getStories();
      return stories;
    },
    story: async (root, { id }) => {
      const story = await StoryService.getStoryById(id);
      return story;
    },
    storiesSearch: async (root, { searchString }) => {
      const stories = await StoryService.searchStory(searchString);
      return stories;
    },
    myStories: async (root, params, { userId }) => {
      const stories = await StoryService.getMyStories({ userId });
      return stories;
    },
  },

  Mutation: {
    createStory: async (root, { input }, { userId }) => {
      const story = await StoryService.createStory(input, userId);
      return story;
    },
    addRatingForStory: async (root, { storyId, rating }, { userId }) => {
      await RatingService.addRatingForStories({ storyId, rating, userId });
      const story = StoryService.getStoryById(storyId);
      return story;
    },
    deleteStory: async (root, { storyId }, { userId }) => {
      await safeFindStory(storyId, userId);
      await StoryService.deleteStory({ storyId, userId });
      return true;
    },
    updateStory: async (root, { input, storyId }, { userId }) => {
      await StoryService.updateStory(storyId, input, { userId });
      const story = StoryService.getStoryById(storyId);
      return story;
    },
  },
};
