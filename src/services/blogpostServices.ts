import { BlogpostInterface, UserInterface } from '../interface'
import { BlogpostModel, UserModel } from '../models'
import { injectable } from 'inversify'

@injectable()
export class BlogpostServices {
  async blogData(body: BlogpostInterface): Promise<void> {
    const { title, content, userID, likes, dislikes } = body
    const newUser = new BlogpostModel({
      title,
      content,
      userID,
      likes,
      dislikes
    })
    await newUser.save()
  }

  async updateBlog(_id: string,update: any, updateBlog: Partial<BlogpostInterface>):Promise<BlogpostInterface|object>{
    const result = await BlogpostModel.findOne({_id: _id , isdeleted: false })
    const uid = result.userID
    const userID = update._id
    
      if(!result){
        const message = {"message" : "blog post is not found"}
        return message
      }
      if(result && uid.toString() === userID && (update.role === "admin" || update.role === "author")){
        await BlogpostModel.findByIdAndUpdate(_id,updateBlog,{new:true})
        const message = {"message" : "BLOG SUCCESSFULLY UPDATED"}
        return message
      }else{
        const message = {"message" : "you can not other's post update"}
        return message
      }
  }

  async deleteBlog(_id: string,delete1: any):Promise<BlogpostInterface|object>{
    const result:BlogpostInterface|null = await BlogpostModel.findOne({_id: _id , isdeleted: false })
    const userId=delete1._id  
    const uid=result.userID;
    if(result&&(uid===userId && delete1.role==='author')||(delete1.role==="admin")){
      
        await BlogpostModel.findByIdAndUpdate(_id,{isdeleted: true})
        const mesage = {"message" : "BLOG SUCCESFULLY DELETED"}
        return mesage
      
    }else{
      const message = {"message" : "You cannot delete other's post"}
      return message
    }
      
  }

  async findAll(_id: string): Promise<void |object>{
    const find = await BlogpostModel.findOne({_id : _id})
    return find
  }
}
