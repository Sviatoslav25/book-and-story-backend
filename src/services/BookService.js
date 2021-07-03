import { ObjectId } from 'mongodb';
import MockDataService from './MockDataService';
import MongoClientProvider from './MongoClientProvider';

class BookService {
  collectionName = 'books';

  getCollection() {
    return MongoClientProvider.db.collection(this.collectionName);
  }

  getBooks = async () => {
    return this.getCollection().find({}).sort({ createdAt: -1 }).toArray();
  };

  createBook = async (book) => {
    const bookData = { ...book, rating: 0, createdAt: new Date() };
    return this.getCollection().insert(bookData);
  };

  getBookById = async (_id) => {
    return this.getCollection().findOne({ _id: ObjectId(_id) });
  };

  searchBooks = async (lineForSearch) => {
    return this.getCollection()
      .find({
        $or: [
          { name: { $regex: lineForSearch, $options: 'i' } },
          { description: { $regex: lineForSearch, $options: 'i' } },
        ],
      })
      .toArray();
  };

  getMyBooks = (authorId) => {
    const books = MockDataService.getBooks();
    return books.filter((book) => book.authorId === authorId);
  };

  deleteBooks = ({ authorId, bookId }) => {
    let books = MockDataService.getBooks();
    books = books.filter((book) => book._id !== bookId || !(book.authorId === authorId));
    MockDataService.setBookList(books);
  };
}

export default new BookService();
