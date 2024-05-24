import { Schema, model } from 'mongoose'
import { BlogpostInterface } from '../interface'

const blogpostSchema = new Schema<BlogpostInterface>(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'userInterface'
    },
    likes: {
      type: Number,
      required: true
    },
    dislikes: {
      type: Number,
      required: true
    },
    isdeleted: {
      type : Boolean,
      default: false,
      required: true
    }
  },
  { timestamps: true }
)

export const BlogpostModel = model<BlogpostInterface>(
  'blogpost',
  blogpostSchema
)
