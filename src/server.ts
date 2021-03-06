import clrs from 'colors';
import cors from 'cors';
import express from 'express';
import bearerToken from 'express-bearer-token';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';

import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

export const app = express();

const logger =
  app.get('env') === 'development'
    ? morgan('dev')
    : morgan('combined', {
      skip: (_, res) => res.statusCode < 500,
    });

app.use(logger);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cors());
app.use(helmet());
app.use(bearerToken());
app.use(routes);
app.use(errorHandler);

export function run(): Promise<http.Server> {
  return new Promise<http.Server>((resolve, reject) => {
    const port = process.env.PORT || 5000;
    const server = app.listen(port);

    server.once('listening', () => {
      console.info(
        clrs.green(`🤟 Server is listening at port ${clrs.yellow(port + '')}`),
      );
      resolve(server);
    });

    server.once('error', err => {
      console.error(
        clrs.red(`🤔 Server failed to listen at ${clrs.yellow(port + '')}`),
      );
      reject(err);
    });
  });
}
