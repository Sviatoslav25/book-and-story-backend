import { gql } from 'apollo-server-express';
import BookService from '../../services/BookService';
import StoryService from '../../services/StoryService';
import NoticesAboutReleasedService from '../../services/NoticesAboutReleasedService';
import ProfileService from '../../services/ProfileService';
import SubscriptionsService from '../../services/SubscriptionsService';
import isAuthorizedUser from '../isAuthorizedUser';

export const typeDefs = gql`
  type NoticeForBook {
    _id: ID!
    authorId: ID!
    userId: ID!
    bookId: ID!
    isRead: Boolean!
    author: Profile!
    book: Book
  }

  type NoticeForStory {
    _id: ID!
    authorId: ID!
    userId: ID!
    storyId: ID!
    isRead: Boolean!
    author: Profile!
    story: Story
  }
  extend type Query {
    noticesAboutBookReleased: [NoticeForBook]!
    noticesQuantity: Int!
    noticesAboutStoryReleased: [NoticeForStory]!
  }

  extend type Mutation {
    subscribe(authorId: ID!): Boolean!
    unsubscribe(authorId: ID!): Boolean!
    readNoticeForBook(noticeId: ID!): Boolean!
    removeNoticeForBook(noticeId: ID!): Boolean!
    readNoticeForStory(noticeId: ID!): Boolean!
    removeNoticeForStory(noticeId: ID!): Boolean!
  }
`;

export const resolvers = {
  Query: {
    noticesAboutBookReleased: async (root, params, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const notices = await NoticesAboutReleasedService.getNoticeForReleasedBook(userId);
      return notices;
    },
    noticesQuantity: async (root, params, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const noticeQuantity = await NoticesAboutReleasedService.noticeQuantity(userId);
      return noticeQuantity;
    },
    noticesAboutStoryReleased: async (root, params, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const notices = await NoticesAboutReleasedService.getNoticeForReleasedStory(userId);
      return notices;
    },
  },

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
    readNoticeForBook: async (root, { noticeId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await NoticesAboutReleasedService.userReadNoticeForBook({ noticeId, userId });
      return true;
    },
    readNoticeForStory: async (root, { noticeId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await NoticesAboutReleasedService.userReadNoticeForStory({ noticeId, userId });
      return true;
    },
    removeNoticeForBook: async (root, { noticeId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await NoticesAboutReleasedService.removeNoticeForBook({ userId, noticeId });
      return true;
    },
    removeNoticeForStory: async (root, { noticeId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await NoticesAboutReleasedService.removeNoticeForStory({ userId, noticeId });
      return true;
    },
  },
  NoticeForBook: {
    author: async ({ authorId }) => {
      const profile = await ProfileService.getProfileByUserId(authorId);
      return profile;
    },
    book: async ({ bookId }, params, { userId }) => {
      try {
        const book = await BookService.getBookById(bookId, userId);
        return book;
      } catch (e) {
        if (e.message === 'Book is Private') {
          return { name: '', img: '', isPrivate: true };
        }
        throw new Error(e.message);
      }
    },
  },

  NoticeForStory: {
    author: async ({ authorId }) => {
      const profile = await ProfileService.getProfileByUserId(authorId);
      return profile;
    },
    story: async ({ storyId }, params, { userId }) => {
      try {
        const story = await StoryService.getStoryById(storyId, userId);
        return story;
      } catch (e) {
        if (e.message === 'Story is private') {
          return { name: '', img: '', isPrivate: true };
        }
        throw new Error(e.message);
      }
    },
  },
};
