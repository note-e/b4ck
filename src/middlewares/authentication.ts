import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

import APIResponse from '../utils/APIResponse';
import {AuthenticatedUser} from './AuthenticatedUser';

export interface IDecodedToken {
  readonly userID: string;
}

export interface IAuthenticatedRequest extends Request {
  authenticatedUser: AuthenticatedUser;
}
/**
 * returns the authenticated user
 * @param token the token in the request
 */
export async function _auth(token: string) {
  const decodedToken = (await jwt.verify(
    token,
    process.env.JWT_SECRET_KEY || '',
  )) as IDecodedToken;
  return new AuthenticatedUser(decodedToken);
}

export async function authenticate(
  req: any,
  res: Response,
  next: NextFunction,
) {
  const token = req.token;

  if (!token) {
    return APIResponse.Unauthorized(res, 'Access denied! No token provided.');
  }

  try {
    // check if the code, user, family are valid
    // can do this with only one find in Code model!
    // TODO can stop user from dashboard here by checking his code
    // add attribute to code that this user is okay to join or not !
    req.authenticatedUser = await _auth(token);
    next();
  } catch (error) {
    return APIResponse.BadRequest(res, error.message);
  }
}
