import bodyParser from 'body-parser';
import authRoutes from '../express/routes/auth';
import bookRoutes from '../express/routes/book';
import storyRoutes from '../express/routes/story';

export default function ExpressLoader(app) {
  app.use(bodyParser.json());
  authRoutes(app);
  bookRoutes(app);
  storyRoutes(app);
}
