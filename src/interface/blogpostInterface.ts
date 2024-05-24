import { Schema } from 'mongoose'

export interface BlogpostInterface {
  title: string
  content: string
  userID: Schema.Types.ObjectId
  likes: number
  dislikes: number
  isdeleted: boolean
}
