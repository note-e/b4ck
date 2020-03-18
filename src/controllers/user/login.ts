import bcrpytjs from 'bcryptjs';
import {Request, Response} from 'express';

import {User, validateUser} from '../../models/user.model';
import APIResponse from '../../utils/APIResponse';

export async function login(req: Request, res: Response) {
  const {error} = validateUser(req.body);
  if (error) {return APIResponse.UnprocessableEntity(res, error.message);}
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {return APIResponse.Unauthorized(res, 'Wrong email or password');}
  const isCorrectPassword = await bcrpytjs.compare(
    req.body.password,
    user.password,
  );
  if (!isCorrectPassword)
    {return APIResponse.Unauthorized(res, 'Wrong email or password');}

  const isCorrectVerificationCode =
    req.body.verificationCode === user.verificationCode;

  if (user.isVerified === false) {
    if (isCorrectVerificationCode) {
      user.isVerified = true;
      await user.save();
    } else {return APIResponse.Unauthorized(res, 'Wrong verification code');}
  }

  return APIResponse.Ok(res, {
    user,
    token: user.generateAuthToken(),
  });
}
