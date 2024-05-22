import { userInterface } from '../interface'
import { userModel } from '../models'
import jwt from 'jsonwebtoken'
import { injectable } from 'inversify'
import dotenv from 'dotenv'

dotenv.config()
const secretkey = process.env.SECRETKEY || ''

@injectable()
export class userServices {
  async userData(body: userInterface): Promise<void> {
    const { name, email, password, profile_info } = body
    const newUser = new userModel({ name, email, password, profile_info })
    await newUser.save()
  }

  async login(email: string, password: string): Promise<String> {
    const user = await userModel.findOne({ email, password })
    if (user) {
      const role = user.profile_info
      const _id = user._id
      const token = jwt.sign({ email, role, _id }, secretkey, {
        expiresIn: '1h'
      })
      return token
    } else {
      return null
    }
  }

  async updateData(
    _id: string,
    updateData: Partial<userInterface>
  ): Promise<void> {
    await userModel.findByIdAndUpdate(_id, updateData, { new: true })
  }

  async deleteData(_id: string): Promise<void> {
    await userModel.findByIdAndUpdate(_id)
  }
}
