import mongoose, { Model, Schema } from 'mongoose';
import type { IPost } from '@/types';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      default: '',
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: '',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

PostSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    const baseSlug = slugify(this.title || 'untitled');
    let slug = baseSlug;
    let counter = 0;
    const PostModel = mongoose.model<IPost>('Post');
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await PostModel.findOne({ slug }).select('_id');
      const isSelf =
        existing && this._id && existing._id.toString() === this._id.toString();
      if (!existing || isSelf) break;
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }
    this.slug = slug;
  }
  next();
});

export type PostDocument = IPost & mongoose.Document;

const Post: Model<IPost> =
  mongoose.models.Post ?? mongoose.model<IPost>('Post', PostSchema);

export default Post;
