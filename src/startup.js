/* eslint-disable no-console */
import express from 'express';
import RootLoader from './loaders';
import logger from './utils/logger';

export default async function startServer() {
  try {
    const app = express();
    const port = process.env.PORT;

    await RootLoader(app);

    app.listen(port, () => {
      logger.info(`Example app listening at http://localhost:${port}`);
    });
  } catch (e) {
    console.log(e.messages);
    process.exit(1);
  }
}
