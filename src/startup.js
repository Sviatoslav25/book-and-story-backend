import express from 'express';
import RootLoader from './loaders';

export default function startServer() {
  const app = express();
  const port = 3011;

  RootLoader(app);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}
