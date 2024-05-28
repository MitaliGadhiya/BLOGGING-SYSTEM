import { UserInterface } from '../interface'
import { UserModel } from '../models'
import jwt from 'jsonwebtoken'
import { injectable } from 'inversify'
import { secretkey } from '../env'

@injectable()
export class UserServices {
  async userData(body: UserInterface): Promise<void> {
    const { name, email, password, profile_info } = body
    const newUser = new UserModel({ name, email, password, profile_info })
    await newUser.save()
  }

  async login(email: string, password: string): Promise<String> {
    const user = await UserModel.findOne({ email, password })
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
    updateData: Partial<UserInterface>
  ): Promise<UserInterface | object> {
    const result = await UserModel.findOne({ _id: _id, isdeleted: true })
    if (result) {
      const message = { message: 'this user already deleted' }
      return message
    } else {
      const updatedObject = await UserModel.findByIdAndUpdate(_id, updateData, {
        new: true
      })
      return updatedObject
    }
  }

  async deleteData(_id: string): Promise<void> {
    await UserModel.findByIdAndUpdate(_id, { isdeleted: true })
  }

  async findAll(_id: string): Promise<void | object> {
    const find = await UserModel.findOne({ _id: _id })
    return find
  }
}
