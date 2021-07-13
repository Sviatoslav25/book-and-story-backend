import BookService from '../../services/BookService';
import RatingService from '../../services/RatingService';
import StoryService from '../../services/StoryService';
import authMiddleware from '../middlewares/auth';
import logger from '../../utils/logger';

const createContext = (req) => {
  return {
    userId: req.jwtUser._id,
  };
};

const wrapPromiseHandler =
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

const findStoryMiddleware = wrapPromiseHandler(async (req, res, next) => {
  const story = await StoryService.getStoryById(req.params.id);
  if (story) {
    req.story = story;
    return next();
  }
  res.status(404);
  res.json({
    error: {
      message: 'Story not found',
    },
  });
  return null;
});

class BookAndStoryRoutesController {
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
    const bookData = { ...body, authorId: userId };
    await BookService.createBook(bookData);
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

  getStories = async (req, res) => {
    const stories = await StoryService.getStories();
    res.json(stories);
  };

  getStoryById = async (req, res) => {
    res.json(req.story);
  };

  createStory = async (req, res) => {
    const { body } = req;
    const { userId: authorId } = createContext(req);
    const storyData = { ...body, authorId };
    await StoryService.createStory(storyData);
    return res.json({ status: 'ok' });
  };

  addRatingForStories = async (req, res) => {
    const { body } = req;
    const { userId } = createContext(req);
    await RatingService.addRatingForStories({
      storyId: body.storyId,
      userId,
      rating: body.rating,
    });
    return res.json({ status: 'ok' });
  };

  storiesSearch = async (req, res) => {
    const { params } = req;
    const storiesFound = await StoryService.searchStory(params.string);
    return res.json(storiesFound);
  };

  getMyStories = async (req, res) => {
    const stories = await StoryService.getMyStories(createContext(req));
    res.json(stories);
  };

  deleteStory = async (req, res) => {
    const { params } = req;
    const { userId: authorId } = createContext(req);
    await StoryService.deleteStory({ authorId, storyId: params.id });
    return res.json({ status: 'ok' });
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

const routesController = new BookAndStoryRoutesController();

const addPostRoutes = (app) => {
  app.get('/api/books/all', authMiddleware, wrapPromiseHandler(routesController.getBooks));

  app.get('/api/stories/all', authMiddleware, wrapPromiseHandler(routesController.getStories));

  app.get('/api/books/book/:id', authMiddleware, findBookMiddleware, wrapPromiseHandler(routesController.getBookById));

  app.get(
    '/api/stories/story/:id',
    authMiddleware,
    findStoryMiddleware,
    wrapPromiseHandler(routesController.getStoryById)
  );

  app.post('/api/books/create', authMiddleware, wrapPromiseHandler(routesController.createBook));

  app.post('/api/stories/create', authMiddleware, wrapPromiseHandler(routesController.createStory));

  app.post('/api/books/add_rating', authMiddleware, wrapPromiseHandler(routesController.addRatingForBooks));

  app.post('/api/stories/add_rating', authMiddleware, wrapPromiseHandler(routesController.addRatingForStories));

  app.get('/api/books/search/:string', authMiddleware, wrapPromiseHandler(routesController.booksSearch));

  app.get('/api/stories/search/:string', authMiddleware, wrapPromiseHandler(routesController.storiesSearch));

  app.get('/api/books/my', authMiddleware, wrapPromiseHandler(routesController.myBooks));

  app.delete('/api/books/delete/:id', authMiddleware, wrapPromiseHandler(routesController.deleteBook));

  app.get('/api/stories/my', authMiddleware, wrapPromiseHandler(routesController.getMyStories));

  app.delete('/api/stories/delete/:id', authMiddleware, wrapPromiseHandler(routesController.deleteStory));

  app.post('/api/books/edit/:id', authMiddleware, wrapPromiseHandler(routesController.updateBook));
};

export default addPostRoutes;
