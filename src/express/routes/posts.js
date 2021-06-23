import MockDataService from '../../services/MockDataService';

const addPostRoutes = (app) => {
  app.get('/api/books/all', (req, res) => {
    res.json(MockDataService.getBooks());
  });

  app.get('/api/stories/all', (req, res) => {
    res.json(MockDataService.getStories());
  });

  app.get('/api/books/:id', (req, res) => {
    const { params } = req;
    const book = MockDataService.getBookById(params.id);
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

  app.get('/api/stories/:id', (req, res) => {
    const { params } = req;
    const story = MockDataService.getStoryById(params.id);
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

  app.post('/api/books/create', (req, res) => {
    const { body } = req;
    MockDataService.createBook(body);
    res.json({ status: 'ok' });
  });

  app.post('/api/stories/create', (req, res) => {
    const { body } = req;
    MockDataService.createStory(body);
    res.json({ status: 'ok' });
  });

  app.post('/api/books/add_rating', (req, res) => {
    const { body } = req;
    const result = MockDataService.addRantingForBook(body.bookId, null, body.rating);
    res.status(result.statusCode);
    res.json({ status: result.message });
  });

  app.post('/api/stories/add_rating', (req, res) => {
    const { body } = req;
    const result = MockDataService.addRantingForStory(body.storyId, null, body.rating);
    res.status(result.statusCode);
    res.json({ status: result.message });
  });

  app.get('/api/books/search/:string', (req, res) => {
    const { params } = req;
    const { string } = params;
    const booksFound = MockDataService.getBooks().filter(
      (book) => book.name.includes(string) || book.description.includes(string)
    );
    res.json(booksFound);
  });

  app.get('/api/stories/search/:string', (req, res) => {
    const { params } = req;
    const { string } = params;
    const storiesFound = MockDataService.getStories().filter(
      (story) => story.name.includes(string) || story.shortDescription.includes(string)
    );
    res.json(storiesFound);
  });
};

export default addPostRoutes;
