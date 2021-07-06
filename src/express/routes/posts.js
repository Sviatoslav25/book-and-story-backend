import BookService from '../../services/BookService';
import RatingService from '../../services/RatingService';
import StoryService from '../../services/StoryService';
import authMiddleware from '../middlewares/auth';

const addPostRoutes = (app) => {
  app.get('/api/books/all', authMiddleware, async (req, res) => {
    const books = await BookService.getBooks();
    res.json(books);
  });

  app.get('/api/stories/all', authMiddleware, async (req, res) => {
    const stories = await StoryService.getStories();
    res.json(stories);
  });

  app.get('/api/books/book/:id', authMiddleware, async (req, res) => {
    const { params } = req;
    const book = await BookService.getBookById(params.id);
    if (book) {
      res.json(book);
    } else {
      res.sendStatus(404);
      res.json({
        error: {
          message: `Book not found`,
        },
      });
    }
  });

  app.get('/api/stories/story/:id', authMiddleware, async (req, res) => {
    const { params } = req;
    const story = await StoryService.getStoryById(params.id);
    if (story) {
      res.json(story);
    } else {
      res.status(404);
      res.json({
        error: {
          message: `Story not found`,
        },
      });
    }
  });

  app.post('/api/books/create', authMiddleware, async (req, res) => {
    const { body } = req;
    const bookData = { ...body, authorId: req.jwtUser._id };
    await BookService.createBook(bookData);
    return res.json({ status: 'ok' });
  });

  app.post('/api/stories/create', authMiddleware, async (req, res) => {
    const { body } = req;
    const storyData = { ...body, authorId: req.jwtUser._id };
    await StoryService.createStory(storyData);
    return res.json({ status: 'ok' });
  });

  app.post('/api/books/add_rating', authMiddleware, async (req, res) => {
    const { body } = req;
    await RatingService.addRatingForBooks({
      bookId: body.bookId,
      userId: req.jwtUser._id,
      rating: body.rating,
    });
    return res.json({ status: 'ok' });
  });

  app.post('/api/stories/add_rating', authMiddleware, async (req, res) => {
    const { body } = req;
    await RatingService.addRatingForStories({
      storyId: body.storyId,
      userId: req.jwtUser._id,
      rating: body.rating,
    });
    return res.json({ status: 'ok' });
  });

  app.get('/api/books/search/:string', authMiddleware, async (req, res) => {
    const { params } = req;
    const { string } = params;
    const booksFound = await BookService.searchBooks(string);
    return res.json(booksFound);
  });

  app.get('/api/stories/search/:string', authMiddleware, async (req, res) => {
    const { params } = req;
    const { string } = params;
    const storiesFound = await StoryService.searchStory(string);
    return res.json(storiesFound);
  });

  app.get('/api/books/my', authMiddleware, async (req, res) => {
    const books = await BookService.getMyBooks(req.jwtUser._id);
    return res.json(books);
  });

  app.delete('/api/books/delete/:id', authMiddleware, async (req, res) => {
    const { params } = req;
    try {
      await BookService.deleteBooks({ authorId: req.jwtUser._id, bookId: params.id });
    } catch (e) {
      res.status(404);
      return res.json({ error: e.message });
    }
    return res.json({ status: 'ok' });
  });

  app.get('/api/stories/my', authMiddleware, async (req, res) => {
    const stories = await StoryService.getMyStories(req.jwtUser._id);
    res.json(stories);
  });

  app.delete('/api/stories/delete/:id', authMiddleware, async (req, res) => {
    const { params } = req;
    await StoryService.deleteStory({ authorId: req.jwtUser._id, storyId: params.id });
    return res.json({ status: 'ok' });
  });
};

export default addPostRoutes;
