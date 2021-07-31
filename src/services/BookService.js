import { ObjectID, ObjectId } from 'mongodb';
import FavoriteService from './FavoriteService';
import MongoClientProvider from './MongoClientProvider';
import RatingService from './RatingService';

class BookService {
  collectionName = 'books';

  getCollection() {
    return MongoClientProvider.db.collection(this.collectionName);
  }

  getBooks = async (userId) => {
    const bookList = await this.getCollection().find({ isPrivate: false }).sort({ createdAt: -1 }).toArray();
    const bookListWithRating = await RatingService.calculateRatingForBookList(bookList);
    return RatingService.userCanAddRatingForBooks({ userId, bookList: bookListWithRating });
  };

  createBook = async (book, authorId) => {
    const bookData = { ...book, createdAt: new Date(), updateAt: new Date(), authorId: new ObjectID(authorId) };
    const result = await this.getCollection().insertOne(bookData);
    return { ...book, _id: result.insertedId };
  };

  getBookById = async (_id, userId) => {
    const book = await this.getCollection().findOne({ _id: ObjectId(_id) });
    if (!book) {
      throw new Error('Book not found');
    }
    book.isFavorite = await FavoriteService.isFavoriteBookForCurrentUser({ bookId: _id, userId });
    return RatingService.calculateRatingForBook(book);
  };

  searchBooks = async (lineForSearch, userId) => {
    const books = await this.getCollection()
      .find({
        $or: [
          { name: { $regex: lineForSearch, $options: 'i' } },
          { description: { $regex: lineForSearch, $options: 'i' } },
        ],
        isPrivate: false,
      })
      .sort({ createdAt: -1 })
      .toArray();
    const bookListWithRating = await RatingService.calculateRatingForBookList(books);
    return RatingService.userCanAddRatingForBooks({ userId, bookList: bookListWithRating });
  };

  getMyBooks = async ({ userId: authorId }) => {
    const books = await this.getCollection()
      .find({ authorId: new ObjectID(authorId) })
      .sort({ createdAt: -1 })
      .toArray();
    return books;
  };

  deleteBook = async (bookId, { userId: authorId }) => {
    const result = await this.getCollection().removeOne({
      _id: new ObjectID(bookId),
      authorId: new ObjectID(authorId),
    });
    if (result.result.n === 0) {
      throw new Error('book has not been deleted');
    }
    await RatingService.getCollectionForBook().remove({ bookId: new ObjectID(bookId) });
  };

  updateBook = async (_id, data, { userId: authorId }) => {
    return this.getCollection().updateOne({ _id: ObjectID(_id), authorId: new ObjectID(authorId) }, { $set: data });
  };

  canViewBook = (book, userId) => {
    const authorObjectId = new ObjectID(book.authorId);
    const userObjectId = new ObjectID(userId);
    if (authorObjectId.equals(userObjectId)) {
      return true;
    }
    return false;
  };

  changePrivacyOfBook = ({ bookId, authorId, isPrivate }) => {
    return this.getCollection().updateOne(
      { _id: new ObjectID(bookId), authorId: new ObjectID(authorId) },
      { $set: { isPrivate } }
    );
  };

  getFavoritesBooks = async (userId) => {
    const result = await FavoriteService.getFavoritesBooks(userId);
    if (result.length === 0) {
      return [];
    }
    const booksId = result.map((item) => {
      return { _id: item.bookId };
    });
    return this.getCollection().find({ $or: booksId }).toArray();
  };
}

export default new BookService();
