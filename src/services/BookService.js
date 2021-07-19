import { ObjectID, ObjectId } from 'mongodb';
import MongoClientProvider from './MongoClientProvider';
import RatingService from './RatingService';

class BookService {
  collectionName = 'books';

  getCollection() {
    return MongoClientProvider.db.collection(this.collectionName);
  }

  getBooks = async () => {
    const bookList = await this.getCollection().find({}).sort({ createdAt: -1 }).toArray();
    return RatingService.calculateRatingForBookList(bookList);
  };

  createBook = async (book, authorId) => {
    const bookData = { ...book, createdAt: new Date(), updateAt: new Date(), authorId: new ObjectID(authorId) };
    const result = await this.getCollection().insert(bookData);
    return { ...book, _id: result.insertedId };
  };

  getBookById = async (_id) => {
    return this.getCollection().findOne({ _id: ObjectId(_id) });
  };

  searchBooks = async (lineForSearch) => {
    const books = await this.getCollection()
      .find({
        $or: [
          { name: { $regex: lineForSearch, $options: 'i' } },
          { description: { $regex: lineForSearch, $options: 'i' } },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();
    return RatingService.calculateRatingForBookList(books);
  };

  getMyBooks = async ({ userId: authorId }) => {
    const books = await this.getCollection()
      .find({ authorId: new ObjectID(authorId) })
      .sort({ createdAt: -1 })
      .toArray();
    return books;
  };

  deleteBook = async (bookId, { userId: authorId }) => {
    const result = await this.getCollection().removeOne({ _id: ObjectID(bookId), authorId: new ObjectID(authorId) });
    if (result.result.n === 0) {
      throw new Error('book has not been deleted');
    }
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
}

export default new BookService();
