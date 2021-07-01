import MockDataService from './MockDataService';

class BookService {
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
