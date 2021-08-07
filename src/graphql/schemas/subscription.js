import { gql } from 'apollo-server-express';
import BookService from '../../services/BookService';
import NoticesAboutReleasedService from '../../services/NoticesAboutReleasedService';
import ProfileService from '../../services/ProfileService';
import SubscriptionsService from '../../services/SubscriptionsService';
import isAuthorizedUser from '../isAuthorizedUser';

export const typeDefs = gql`
  type Notice {
    _id: ID!
    authorId: ID!
    userId: ID!
    bookId: ID!
    isRead: Boolean!
    author: Profile!
    book: Book!
  }
  extend type Query {
    noticesAboutBookReleased: [Notice]!
    noticesQuantity: Int!
  }

  extend type Mutation {
    subscribe(authorId: ID!): Boolean!
    unsubscribe(authorId: ID!): Boolean!
    readNoticeForBooks(noticeId: ID!): Boolean!
  }
`;

export const resolvers = {
  Query: {
    noticesAboutBookReleased: async (root, params, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const notices = await NoticesAboutReleasedService.getNoticeForUser(userId);
      return notices;
    },
    noticesQuantity: async (root, params, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const noticeQuantity = await NoticesAboutReleasedService.noticeQuantity(userId);
      return noticeQuantity;
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
    readNoticeForBooks: async (root, { noticeId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await NoticesAboutReleasedService.userReadNoticeForBook({ noticeId, userId });
      return true;
    },
  },
  Notice: {
    author: async ({ authorId }) => {
      const profile = await ProfileService.getProfileByUserId(authorId);
      return profile;
    },
    book: async ({ bookId }, params, { userId }) => {
      const book = await BookService.getBookById(bookId, userId);
      return book;
    },
  },
};
