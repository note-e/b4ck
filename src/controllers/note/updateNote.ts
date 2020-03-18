import { Request, Response } from 'express';
import _ from 'lodash';

import { IAuthenticatedRequest } from '../../middlewares';
import { Note } from '../../models/note.model';
import APIResponse from '../../utils/APIResponse';

export async function updateNote(req: Request, res: Response): Promise<Response> {
  const user = (req as IAuthenticatedRequest).authenticatedUser;
  const _id = req.params.id; // note id
  const note = await Note.findById(_id);

  if (!note) { return APIResponse.NotFound(res, `No note with id: ${_id}`); }
  if (note.user.toString() !== user.userID) { return APIResponse.Forbidden(res, 'Access Denied!'); }

  _.extend(note, req.body);

  try {
    await note.save();
    return APIResponse.Ok(res, note);
  } catch (err) {
    console.error(err);
    return APIResponse.UnprocessableEntity(res, err.message);
  }
}
