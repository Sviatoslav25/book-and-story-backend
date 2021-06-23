import express from 'express';
import RootLoader from './loaders';

export default function startServer() {
  const app = express();
  const port = process.env.PORT;

  RootLoader(app);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}
