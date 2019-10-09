import exp from 'express';

import * as noteController from '../controllers/note/';

const router = exp.Router();

router.post('/', noteController.createNote);
router.get('/', noteController.getMyNotes);
router.patch('/:id', noteController.updateNote);

export default router;
