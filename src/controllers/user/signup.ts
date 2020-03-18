import bcrpytjs from 'bcryptjs';
import {Request, Response} from 'express';

import {User, validateUser} from '../../models/user.model';
import APIResponse from '../../utils/APIResponse';

export async function signup(req: Request, res: Response) {
  const {error} = validateUser(req.body);
  if (error) {return APIResponse.UnprocessableEntity(res, error.message);}
  const userAlreadyExists = await User.exists({
    email: req.body.email,
  });
  if (userAlreadyExists)
    {return APIResponse.UnprocessableEntity(res, 'This email already exists!');}

  const salt = await bcrpytjs.genSalt();
  req.body.password = await bcrpytjs.hash(req.body.password, salt);

  const user = new User(req.body);
  user.sendVerificationEmail();
  user.save();
  return APIResponse.Ok(res, {
    message: 'An email has been sent, use the verification code to sign in.',
  });
}
