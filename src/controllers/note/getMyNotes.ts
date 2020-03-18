import { Request, Response } from 'express';

import { IAuthenticatedRequest } from '../../middlewares';
import { Note } from '../../models/note.model';
import APIResponse from '../../utils/APIResponse';

export async function getMyNotes(req: Request, res: Response): Promise<Response> {
  const user = (req as IAuthenticatedRequest).authenticatedUser.userID;
  const notes = await Note.find({
    user,
  });
  return APIResponse.Ok(res, notes);
}
