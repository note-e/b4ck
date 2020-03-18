import { Request, Response } from 'express';

import { IAuthenticatedRequest } from '../../middlewares';
import { Note, validateNote } from '../../models/note.model';
import APIResponse from '../../utils/APIResponse';

export async function createNote(req: Request, res: Response): Promise<Response> {
  req.body.user = (req as IAuthenticatedRequest).authenticatedUser.userID;
  const { error } = validateNote(req.body);
  if (error) { return APIResponse.UnprocessableEntity(res, error.message); }
  const note = new Note(req.body);
  await note.save();
  return APIResponse.Ok(res, note);
}
