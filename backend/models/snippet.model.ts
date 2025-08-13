import mongoose from 'mongoose';
import { ISnippet } from '../types';

const snippetSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50000,
    trim: true
  },
  summary: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false
});

snippetSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

export const Snippet = mongoose.model<ISnippet>('Snippet', snippetSchema);