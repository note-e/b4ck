import clrs from 'colors';

import * as config from './config';
import * as database from './database';
import * as server from './server';

try {
  config.check()
  database.connect();
  server.run();
  console.info(clrs.green('🕹  Enjoy! 😚'));
} catch (err) {
  console.error(err);
  process.exit(1);
}
