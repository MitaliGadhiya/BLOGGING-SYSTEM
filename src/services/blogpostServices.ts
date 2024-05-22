import { blogpostInterface } from '../interface'
import { blogpostModel, userModel } from '../models'
import { injectable } from 'inversify'

@injectable()
export class blogpostServices {
  async blogData(body: blogpostInterface): Promise<void> {
    const { title, content, userID, likes, dislikes } = body
    const newUser = new blogpostModel({
      title,
      content,
      userID,
      likes,
      dislikes
    })
    await newUser.save()
  }

  async updateBlog(_id: string, updateBlog: Partial<blogpostInterface>):Promise<void>{
    await blogpostModel.findByIdAndUpdate(_id,updateBlog,{new:true})
  }

  async deleteBlog(_id: string):Promise<void>{
    await blogpostModel.findByIdAndDelete(_id)
  }
}
