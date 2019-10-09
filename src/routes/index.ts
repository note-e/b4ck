import exp from 'express';

import * as userController from '../controllers/user';
import {authenticate} from '../middlewares';
import note from './note.route';

const router = exp.Router();

router.post('/login', userController.login);
router.post('/signup', userController.signup);

router.use(authenticate);

router.use('/notes', note);

// 404
router.all('*', (_, res) =>
  res.status(404).json({message: '🤔 Are you lost ?!'}),
);

export default router;
