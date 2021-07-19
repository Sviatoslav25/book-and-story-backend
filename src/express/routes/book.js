import BookService from '../../services/BookService';
import RatingService from '../../services/RatingService';
import authMiddleware from '../middlewares/auth';
import logger from '../../utils/logger';

export const createContext = (req) => {
  return {
    userId: req.jwtUser._id,
  };
};

export const wrapPromiseHandler =
  (handler) =>
  async (...args) => {
    const [, res] = args;
    try {
      await handler(...args);
    } catch (e) {
      logger.error(e);
      res.status(500);
      res.json({
        error: {
          message: 'Internal server error',
        },
      });
    }
  };

const findBookMiddleware = wrapPromiseHandler(async (req, res, next) => {
  const book = await BookService.getBookById(req.params.id);
  if (book) {
    req.book = book;
    return next();
  }
  res.status(404);
  res.json({
    error: {
      message: 'Book not found',
    },
  });
  return null;
});

class BookRoutesController {
  getBooks = async (req, res) => {
    const books = await BookService.getBooks();
    res.json(books);
  };

  getBookById = (req, res) => {
    const { book } = req;
    res.json(book);
  };

  createBook = async (req, res) => {
    const { body } = req;
    const { userId } = createContext(req);
    await BookService.createBook(body, userId);
    return res.json({ status: 'ok' });
  };

  addRatingForBooks = async (req, res) => {
    const { body } = req;
    const { userId } = createContext(req);
    await RatingService.addRatingForBooks({
      bookId: body.bookId,
      userId,
      rating: body.rating,
    });
    return res.json({ status: 'ok' });
  };

  booksSearch = async (req, res) => {
    const { params } = req;
    const { string } = params;
    const booksFound = await BookService.searchBooks(string);
    return res.json(booksFound);
  };

  deleteBook = async (req, res) => {
    const { params } = req;
    await BookService.deleteBooks(params.id, createContext(req));
    return res.json({ status: 'ok' });
  };

  myBooks = async (req, res) => {
    const books = await BookService.getMyBooks(createContext(req));
    return res.json(books);
  };

  updateBook = async (req, res) => {
    const {
      params: { id },
      body,
    } = req;
    await BookService.updateBook(id, body.bookData, createContext(req));
    const book = await BookService.getBookById(id);
    res.json(book);
  };
}

const routesController = new BookRoutesController();

const addBookRoutes = (app) => {
  app.get('/api/books/all', authMiddleware, wrapPromiseHandler(routesController.getBooks));

  app.get('/api/books/book/:id', authMiddleware, findBookMiddleware, wrapPromiseHandler(routesController.getBookById));

  app.post('/api/books/create', authMiddleware, wrapPromiseHandler(routesController.createBook));

  app.post('/api/books/add_rating', authMiddleware, wrapPromiseHandler(routesController.addRatingForBooks));

  app.get('/api/books/search/:string', authMiddleware, wrapPromiseHandler(routesController.booksSearch));

  app.get('/api/books/my', authMiddleware, wrapPromiseHandler(routesController.myBooks));

  app.delete('/api/books/delete/:id', authMiddleware, wrapPromiseHandler(routesController.deleteBook));

  app.post('/api/books/update/:id', authMiddleware, wrapPromiseHandler(routesController.updateBook));
};

export default addBookRoutes;
