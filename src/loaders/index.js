/* eslint-disable no-console */
import dbLoader from './db';
import expressLoader from './express';
import fixturesLoader from './fixture';

export default async function RootLoader(app) {
  console.log('Connecting to the db...');
  await dbLoader();
  console.log('Connected to the db successfully');
  console.log('Starting express server...');
  expressLoader(app);
  console.log('Express server started successfully');
  console.log('Started processing fixture');
  fixturesLoader();
  console.log('fixture processed successfully');
}
