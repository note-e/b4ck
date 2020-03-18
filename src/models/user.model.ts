import jwt from 'jsonwebtoken';
import _ from 'lodash';
import mongoose from 'mongoose';

import joi from '@hapi/joi';

import { sendEmail } from '../services/nodemailer';
import { generateRandomNumber } from '../utils';

export const PRIVATE_USER_ATTRIBUTES = [
  'password',
  'isVerified',
  'verificationCode',
  'updatedAt',
  'createdAt',
  '__v',
];

interface IProjection {
  [x: string]: number;
}

export function getUserProjectAttributes(
  prefixes?: string[],
  base?: IProjection,
): IProjection {
  return PRIVATE_USER_ATTRIBUTES.reduce((obj, item) => {
    if (prefixes) { for (const prefix of prefixes) { obj[`${prefix}.${item}`] = 0; } }
    else { obj[item] = 0; }
    return obj;
  }, base || {});
}

export interface IUser {
  name: string;
  photo: string;
  bio: string;
  email: string;
  password: string;
  verificationCode: string;
  isVerified: boolean;
  sendVerificationEmail: () => void;
  generateAuthToken: () => string;
}

export interface IUserModel extends IUser, mongoose.Document { }

export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 1,
      maxlength: 100,
      trim: true,
    },
    photo: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 100,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.methods.toJSON = function (): {} {
  const doc = this.toObject();
  return _.omit(doc, PRIVATE_USER_ATTRIBUTES);
};

userSchema.methods.sendVerificationEmail = function (): void {
  this.verificationCode = generateRandomNumber(6);
  sendEmail({
    to: this.email,
    subject: 'Registration - Verification mail',
    html: `Your verification code is <b>${this.verificationCode}</b>`,
  });
};

userSchema.methods.generateAuthToken = function (): string {
  return jwt.sign(
    {
      userID: this._id,
    },
    process.env.JWT_SECRET_KEY || '',
  );
};

export const User = mongoose.model<IUserModel>('User', userSchema);

export function validateUser(user: any): joi.ValidationResult<any> {
  const schema = joi.object({
    name: joi
      .string()
      .min(1)
      .max(100),
    photo: joi.string().uri(),
    bio: joi.string().max(100),
    email: joi
      .string()
      .email()
      .required(),
    password: joi
      .string()
      .min(8)
      .required(),
    verificationCode: joi.string(),
    isVerified: joi.boolean(),
  });
  return schema.validate(user);
}
