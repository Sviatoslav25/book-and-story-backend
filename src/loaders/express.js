import bodyParser from 'body-parser';
import MockDataService from '../services/MockDataService';

export default function ExpressLoader(app) {
  app.use(bodyParser.json());
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

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
      res.status(404);
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
}
