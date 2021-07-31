import { gql } from 'apollo-server-express';
import BookService from '../../services/BookService';
import RatingService from '../../services/RatingService';
import isAuthorizedUser from '../isAuthorizedUser';
import UserService from '../../services/UserService';
import FavoriteService from '../../services/FavoriteService';

export const typeDefs = gql`
  type Book {
    _id: ID!
    name: String!
    img: String!
    authorId: ID!
    author: User!
    genre: String!
    otherAuthors: [String]!
    pagesQuantity: Int!
    isPaid: Boolean!
    price: Float
    rating: Float!
    description: String!
    userCanAddRating: Boolean!
    bookURL: String!
    createAt: Float!
    updateAt: Float!
    isPrivate: Boolean!
    isFavorite: Boolean
  }

  input BookCreateInput {
    name: String!
    img: String!
    genre: String!
    otherAuthors: [String]!
    pagesQuantity: Int!
    isPaid: Boolean!
    price: Float
    description: String!
    bookURL: String!
    isPrivate: Boolean!
  }
  input BookUpdateInput {
    name: String
    img: String
    genre: String
    otherAuthors: [String]
    pagesQuantity: Int
    isPaid: Boolean
    price: Float
    description: String
    bookURL: String
    isPrivate: Boolean
  }

  extend type Query {
    books: [Book]!
    book(id: ID!): Book!
    booksSearch(searchString: String!): [Book]!
    myBooks: [Book]!
    favoritesBooks: [Book]!
  }

  extend type Mutation {
    createBook(input: BookCreateInput!): Book!
    addRatingForBook(bookId: ID!, rating: Int!): Book!
    deleteBook(bookId: ID!): Boolean!
    updateBook(bookId: ID!, input: BookUpdateInput!): Book!
    changePrivacyOfBook(bookId: ID!, isPrivate: Boolean!): Book!
    addBookToFavorites(bookId: ID!): Boolean!
    removeBookFromFavorites(bookId: ID!): Boolean!
  }
`;

const safeFindBook = async (bookId, userId) => {
  const book = await BookService.getBookById(bookId, userId);
  if (!book) {
    throw new Error('Book not found');
  }
  const canViewBook = BookService.canViewBook(book, userId);
  if (!canViewBook) {
    throw new Error('Access denied');
  }
  return book;
};

export const resolvers = {
  Query: {
    books: async (root, params, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const books = await BookService.getBooks(userId);
      return books;
    },
    book: async (root, { id }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const book = await BookService.getBookById(id, userId);
      return book;
    },
    booksSearch: async (root, { searchString }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const booksFound = await BookService.searchBooks(searchString, userId);
      return booksFound;
    },
    myBooks: async (root, params, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const books = await BookService.getMyBooks({ userId });
      return books;
    },
    favoritesBooks: async (root, params, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const favoritesBooks = await BookService.getFavoritesBooks(userId);
      return favoritesBooks;
    },
  },

  Mutation: {
    createBook: async (root, { input }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      const book = await BookService.createBook(input, userId);
      return book;
    },
    addRatingForBook: async (root, { bookId, rating }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await RatingService.addRatingForBooks({
        bookId,
        userId,
        rating,
      });
      const book = await BookService.getBookById(bookId);
      return book;
    },
    deleteBook: async (root, { bookId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await safeFindBook(bookId, userId);
      await BookService.deleteBook(bookId, { userId });
      return true;
    },
    updateBook: async (root, { bookId, input }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await BookService.updateBook(bookId, input, { userId });
      const book = await BookService.getBookById(bookId);
      return book;
    },
    changePrivacyOfBook: async (root, { bookId, isPrivate }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await safeFindBook(bookId, userId);
      await BookService.changePrivacyOfBook({ bookId, isPrivate, authorId: userId });
      const book = await BookService.getBookById(bookId);
      return book;
    },
    addBookToFavorites: async (root, { bookId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await FavoriteService.addBookToFavorites({ bookId, userId });
      return true;
    },
    removeBookFromFavorites: async (root, { bookId }, context) => {
      isAuthorizedUser(context);
      const { userId } = context;
      await FavoriteService.removeBookFromFavorite({ bookId, userId });
      return true;
    },
  },
  Book: {
    author: async (root) => {
      const user = await UserService.findById(root.authorId);
      return user;
    },
  },
};
