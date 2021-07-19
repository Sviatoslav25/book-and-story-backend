import { gql } from 'apollo-server-express';
import BookService from '../../services/BookService';
import RatingService from '../../services/RatingService';

export const typeDefs = gql`
  type Book {
    _id: ID!
    name: String!
    date: Float!
    img: String!
    authorId: ID!
    genre: String!
    otherAuthors: [String]!
    pageQuantity: Int!
    isPaid: Boolean!
    price: Float
    rating: Float!
    description: String!
    bookURL: String!
    createAt: Float!
    updateAt: Float!
  }

  input BookCreateInput {
    name: String!
    img: String!
    genre: String!
    otherAuthors: [String]!
    pageQuantity: Int!
    isPaid: Boolean!
    price: Float
    description: String!
    bookURL: String!
  }
  input BookUpdateInput {
    name: String
    img: String
    genre: String
    otherAuthors: [String]
    pageQuantity: Int
    isPaid: Boolean
    price: Float
    description: String
    bookURL: String
  }

  extend type Query {
    books: [Book]!
    book(id: ID!): Book!
    booksSearch(searchString: String!): [Book]!
    myBooks: [Book]!
  }

  extend type Mutation {
    createBook(input: BookCreateInput): Book!
    addRatingForBook(bookId: ID!, rating: Int!): Book!
    deleteBook(booId: ID!): Boolean!
    updateBook(bookId: ID!, input: BookUpdateInput): Book!
  }
`;

const safeFindBook = async (bookId, userId) => {
  const book = await BookService.getBookById(bookId);
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
    books: async () => {
      const books = await BookService.getBooks();
      return books;
    },
    book: async (root, { bookId }) => {
      const book = await BookService.getBookById(bookId);
      return book;
    },
    booksSearch: async (root, { searchString }) => {
      const booksFound = await BookService.searchBooks(searchString);
      return booksFound;
    },
    myBooks: async (root, params, { userId }) => {
      const books = await BookService.getMyBooks({ userId });
      return books;
    },
  },

  Mutation: {
    createBook: async (root, { input }, { userId }) => {
      const book = await BookService.createBook(input, userId);
      return book;
    },
    addRatingForBook: async (root, { bookId, rating }, { userId }) => {
      await RatingService.addRatingForBooks({
        bookId,
        userId,
        rating,
      });
      const book = await BookService.getBookById(bookId);
      return book;
    },
    deleteBook: async (root, { bookId }, { userId }) => {
      await safeFindBook(bookId, userId);
      await BookService.deleteBook(bookId, { userId });
      return true;
    },
    updateBook: async (root, { bookId, input }, { userId }) => {
      await BookService.updateBook(bookId, input, { userId });
      const book = await BookService.getBookById(bookId);
      return book;
    },
  },
};
