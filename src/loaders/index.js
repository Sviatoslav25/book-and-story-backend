import expressLoader from './express';
import fixturesLoader from './fixture';

export default function RootLoader(app) {
  expressLoader(app);
  fixturesLoader();
}
