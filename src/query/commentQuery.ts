import { CommentModel } from '../models'
import { injectable } from 'inversify'
import { CommentInterface } from '../interface'
import { PipelineStage } from 'mongoose'

@injectable()
export class CommentQuery {
  async findAll(
    filters: string | undefined,
    search: string | undefined,
    page: number = 1,
    limit: number = 10
  ): Promise<{ comment: CommentInterface[]; total_pages: number }> {
    const filter: any = {}

    // Define initial aggregation stages to add necessary fields
    const aggregationStages: PipelineStage[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'userID',
          foreignField: '_id',
          as: 'user_comment'
        }
      },
      {
        $unwind: {
          path: '$user_comment',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'blogposts',
          localField: 'blogpostID',
          foreignField: '_id',
          as: 'blog_comment'
        }
      },
      {
        $unwind: {
          path: '$blog_comment',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          userName: { $ifNull: ['$user_comment.name', null] },
          userEmail: { $ifNull: ['$user_comment.email', null] },
          userProfile: { $ifNull: ['$user_comment.profile_info', null] },
          blogContent: { $ifNull: ['$blog_comment.content', null] },
          blogTitle: { $ifNull: ['$blog_comment.title', null] },
          blogLikes: { $ifNull: ['$blog_comment.likes', 0] },
          blogDislikes: { $ifNull: ['$blog_comment.dislikes', 0] }
        }
      }
    ]

    // Construct the filter based on search criteria after fields are added
    if (search) {
      const searchNumber = parseInt(search, 10)
      if (!isNaN(searchNumber)) {
        filter.$or = [
          { content: { $regex: search, $options: 'i' } },
          { userName: { $regex: search, $options: 'i' } },
          { userEmail: { $regex: search, $options: 'i' } },
          { userProfile: { $regex: search, $options: 'i' } },
          { blogTitle: { $regex: search, $options: 'i' } },
          { blogContent: { $regex: search, $options: 'i' } },
          { likes: searchNumber },
          { dislikes: searchNumber },
          { blogLikes: searchNumber },
          { blogDislikes: searchNumber }
        ]
      } else {
        filter.$or = [
          { content: { $regex: search, $options: 'i' } },
          { userName: { $regex: search, $options: 'i' } },
          { userEmail: { $regex: search, $options: 'i' } },
          { userProfile: { $regex: search, $options: 'i' } },
          { blogTitle: { $regex: search, $options: 'i' } },
          { blogContent: { $regex: search, $options: 'i' } }
        ]
      }
    }

    // Parse and apply additional filters
    if (filters) {
      const filterPairs = filters.split('&')
      filterPairs.forEach(pair => {
        const [key, value] = pair.split('=')
        if (value !== undefined) {
          filter[key] = value
        } else {
          throw new Error('Invalid key-value pair')
        }
      })
    }

    // Add match, skip, and limit stages to the aggregation pipeline
    aggregationStages.push(
      { $match: filter },
      {
        $project: {
          userName: 1,
          userEmail: 1,
          userProfile: 1,
          blogContent: 1,
          blogTitle: 1,
          blogLikes: 1,
          blogDislikes: 1,
          content: 1,
          likes: 1,
          dislikes: 1
        }
      },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    )

    // Execute the aggregation pipeline
    const comments = await CommentModel.aggregate(aggregationStages)

    // Count total documents for pagination
    const totalCount = await CommentModel.countDocuments(filter)
    const total_pages = Math.ceil(totalCount / limit)

    return { comment: comments, total_pages }
  }
}
