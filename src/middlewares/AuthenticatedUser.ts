import mongoose from 'mongoose';

import { User, IUserModel } from '../models/user.model';
import { IDecodedToken } from './authentication';

export class AuthenticatedUser {
  public readonly userID: string;

  constructor(decodedToken: IDecodedToken) {
    this.userID = decodedToken.userID;
  }

  public async getUserFromDB(): Promise<IUserModel | null> {
    return await User.findById(this.userID);
  }

  public async isVerified(): Promise<boolean> {
    const user = await User.findById(this.userID).select('isVerified');
    return !!user && user.isVerified === true;
  }

  public toObjectID(str: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(str);
  }
}
