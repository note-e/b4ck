import mongoose from 'mongoose';

import joi from '@hapi/joi';

import { enumToArray } from '../utils';

export interface INote {
  title: string;
  description: string;
  user: object | string;
  status: string;
  deadline: Date;
}

export interface INoteModel extends INote, mongoose.Document { }

export enum NoteStatus {
  TODO,
  DONE,
}

export const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: enumToArray(NoteStatus),
      default: NoteStatus[NoteStatus.TODO],
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Note = mongoose.model<INoteModel>('Note', noteSchema);
export const canEdit = ['title', 'description'];

export function validateNote(note: {}): joi.ValidationResult<any> {
  const schema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    user: joi.any().required(),
    status: joi.string().allow(...enumToArray(NoteStatus)),
    deadline: joi.date(),
  });
  return schema.validate(note);
}
