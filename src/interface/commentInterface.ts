import mongoose from 'mongoose'

export interface CommentInterface {
  content: string
  userID: mongoose.Types.ObjectId
  blogpostID: mongoose.Types.ObjectId
  likes: number
  dislike: number
  isdeleted: boolean
}
