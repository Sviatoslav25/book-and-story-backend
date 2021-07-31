/* eslint-disable no-console */
import logger from '../utils/logger';
import dbLoader from './db';
import expressLoader from './express';
import apolloLoader from './apollo';

export default async function RootLoader(app) {
  logger.info('Connecting to the db...');
  await dbLoader();
  logger.info('Connected to the db successfully');

  logger.info('Starting apollo server...');
  apolloLoader(app);
  logger.info('Apollo server started successfully');

  logger.info('Starting express server...');
  expressLoader(app);
  logger.info('Express server started successfully');
}
