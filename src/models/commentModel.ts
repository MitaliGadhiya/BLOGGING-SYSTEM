import { Schema, model } from 'mongoose'
import { CommentInterface } from '../interface'


const commentSchema = new Schema<CommentInterface>(
  {
    content: {
      type: String,
      required: true
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'userInterface',
      required: true
    },
    blogpostID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'blogpostInterface'
    },
    likes: { 
      type: Number,
      required: true
    },
    dislike: {
      type: Number,
      required: true
    },
    isdeleted: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  { timestamps: true }
)

export const CommentModel = model<CommentInterface>('comment', commentSchema)
