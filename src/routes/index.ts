import exp from 'express';

import * as userController from '../controllers/user';

const router = exp.Router();

router.post('/login', userController.login);
router.post('/signup', userController.signup);

// 404
router.all('*', (_, res) =>
  res.status(404).json({message: '🤔 Are you lost ?!'}),
);

export default router;
