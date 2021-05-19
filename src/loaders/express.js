import MockDataService from '../services/MockDataService';

export default function ExpressLoader(app) {
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.get('/books/all', (req, res) => {
    res.json(MockDataService.getBooks());
  });

  app.get('/stories/all', (req, res) => {
    res.json(MockDataService.getStories());
  });

  app.get('/books/:id', (req, res) => {
    const { params } = req;
    const book = MockDataService.getBookById(params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404);
      res.json({
        error: {
          message: `Book not found`,
        },
      });
    }
  });

  app.get('/stories/:id', (req, res) => {
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
}
