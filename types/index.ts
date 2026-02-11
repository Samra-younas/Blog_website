import type { Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  createdAt?: Date;
}

export interface IPost {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
