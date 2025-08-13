import { Document, Types } from 'mongoose';

export interface ISnippet extends Document {
  _id: Types.ObjectId;
  text: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface CreateSnippetData {
  text: string;
}

export interface GetAllSnippetsOptions {
  limit?: string | number;
  offset?: string | number;
}

export interface AIClient {
  generateSummary: (text: string) => Promise<string>;
}