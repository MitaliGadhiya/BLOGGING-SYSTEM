import { Schema, model } from 'mongoose'
import { UserInterface } from '../interface'


const userSchema = new Schema<UserInterface>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profile_info: {
      type: String,
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

export const UserModel = model<UserInterface>('users', userSchema)
