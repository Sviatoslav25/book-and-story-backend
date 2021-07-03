/* eslint-disable no-console */
import logger from '../utilse/logger';
import dbLoader from './db';
import expressLoader from './express';
import fixturesLoader from './fixture';

export default async function RootLoader(app) {
  logger.info('Connecting to the db...');
  await dbLoader();
  logger.info('Connected to the db successfully');
  logger.info('Starting express server...');
  expressLoader(app);
  logger.info('Express server started successfully');
  logger.info('Started processing fixture');
  fixturesLoader();
  logger.info('fixture processed successfully');
}
