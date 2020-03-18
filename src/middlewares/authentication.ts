import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import APIResponse from '../utils/APIResponse';
import { AuthenticatedUser } from './AuthenticatedUser';

export interface IDecodedToken {
  readonly userID: string;
}

export interface IAuthenticatedRequest extends Request {
  authenticatedUser: AuthenticatedUser;
  token: string;
}
/**
 * returns the authenticated user
 * @param token the token in the request
 */
export function _auth(token: string): AuthenticatedUser {
  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY || '',
  ) as IDecodedToken;
  return new AuthenticatedUser(decodedToken);
}

export function authenticate(
  req: any,
  res: Response,
  next: NextFunction,
): Response | undefined {
  const token = req.token;

  if (!token) {
    return APIResponse.Unauthorized(res, 'Access denied! No token provided.');
  }

  try {
    req.authenticatedUser = _auth(token);
    next();
  } catch (error) {
    console.error(error)
    return APIResponse.BadRequest(res);
  }
}
