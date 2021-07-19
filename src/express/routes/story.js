import RatingService from '../../services/RatingService';
import StoryService from '../../services/StoryService';
import authMiddleware from '../middlewares/auth';
import { createContext, wrapPromiseHandler } from './book';

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

class StoryRoutesController {
  getStories = async (req, res) => {
    const stories = await StoryService.getStories();
    res.json(stories);
  };

  getStoryById = async (req, res) => {
    res.json(req.story);
  };

  createStory = async (req, res) => {
    const { body } = req;
    const { userId } = createContext(req);
    await StoryService.createStory(body, userId);
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

  updateStory = async (req, res) => {
    const {
      params: { id },
      body,
    } = req;
    await StoryService.updateStory(id, body.storyData, createContext(req));
    const story = await StoryService.getStoryById(id);
    res.json(story);
  };
}

const routesController = new StoryRoutesController();

const addStoryRoutes = (app) => {
  app.get('/api/stories/all', authMiddleware, wrapPromiseHandler(routesController.getStories));

  app.get(
    '/api/stories/story/:id',
    authMiddleware,
    findStoryMiddleware,
    wrapPromiseHandler(routesController.getStoryById)
  );

  app.post('/api/stories/create', authMiddleware, wrapPromiseHandler(routesController.createStory));

  app.post('/api/stories/add_rating', authMiddleware, wrapPromiseHandler(routesController.addRatingForStories));

  app.get('/api/stories/search/:string', authMiddleware, wrapPromiseHandler(routesController.storiesSearch));

  app.get('/api/stories/my', authMiddleware, wrapPromiseHandler(routesController.getMyStories));

  app.delete('/api/stories/delete/:id', authMiddleware, wrapPromiseHandler(routesController.deleteStory));

  app.post('/api/stories/update/:id', authMiddleware, wrapPromiseHandler(routesController.updateStory));
};

export default addStoryRoutes;
