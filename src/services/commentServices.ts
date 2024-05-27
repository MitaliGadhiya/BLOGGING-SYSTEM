import { CommentModel } from '../models'
import { ContainerModule, injectable } from 'inversify'
import { CommentInterface } from '../interface'
import { BlogpostModel } from '../models'
import mongoose from 'mongoose'

@injectable()
export class CommentServices {
  async commentData(blogpostID: string,body: CommentInterface): Promise<CommentInterface|object> {
    const { content, userID, likes, dislike, isdeleted } = body
    const result = await BlogpostModel.findOne({_id: blogpostID,isdeleted:false})
    if(result){
      const newUser = new CommentModel({
        content,
        userID,
        blogpostID,
        likes,
        dislike,
        isdeleted
      })
      await newUser.save()
      const mesage = {"message" : "COMMENT SUCCESSFULLY INSERTED"}
      return mesage
    }
    else{
      const message = {"message" : "this blog already deleted"}
      return message
    }
    
  }

  async updateComment(
    commentID: object,
    blogpostID: string,
    update: any,
    updateComment: Partial<CommentInterface>
  ): Promise<CommentInterface | object> {
    const result1 = await BlogpostModel.findOne({ _id: blogpostID, isdeleted: false });
    if (!result1) {
      return { message: "This blog post is already deleted" };
    }
  
    const result = await CommentModel.findOne({ _id: commentID, blogpostID: blogpostID, isdeleted: false});
    if (!result) {
      return { message: "Comment not found" };
    }
  
    const uid = result.userID;
    if (!uid) {
      return { message: "User ID not found for the comment" };
    }
    console.log("uid : ", uid);

    const userID = update._id;

    console.log("userID : ", userID);
  
    if (uid.toString() === userID.toString()) {
      const updatedComment = await CommentModel.findByIdAndUpdate(commentID, updateComment, { new: true });
      if (!updatedComment) {
        return { message: "Comment not found" };
      }
      return { message: "COMMENT UPDATED", updatedComment };
    } else {
      return { message: "You cannot update other's comment" };
    }
  }
  
  async deleteComment(
    commentID : object,
    blogpostID: object,
    delete1: any
    
  ): Promise<CommentInterface | object> {
    const blogresult = await BlogpostModel.findOne({_id: blogpostID,isdeleted:false});
    if (!blogresult) {
      return { message: "Blog not found" };
    }
    
    const bloguserID = blogresult.userID;
  
    const commentresult = await CommentModel.findOne({ _id: commentID, blogpostID: blogpostID , isdeleted :false});
    if (!commentresult) {
      return { message: "Comment not found" };
    }
  
    const commentuserID = commentresult.userID;
    console.log("commentID : ", commentuserID);
  
    const userID = delete1._id;
  
    if (
      bloguserID.toString() === commentuserID.toString() ||
      delete1.role === "admin" ||
      (delete1.role === "user" && commentuserID.toString() === userID)
    ) {
      await CommentModel.findByIdAndUpdate(commentID, { isdeleted: true });
      const message = { message: "COMMENT SUCCESSFULLY DELETED" };
      return message;
    } else {
      const message = { message: "You cannot delete other's comment" };
      return message;
    }
  }
  

  async findAll(_id: string): Promise<void |object>{
    const find = await CommentModel.findOne({_id : _id})
    return find
  }

}
