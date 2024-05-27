import { BlogpostModel } from '../models'
import { injectable } from 'inversify'
import { BlogpostInterface } from '../interface'
import { PipelineStage } from 'mongoose'

@injectable()
export class BlogpostQuery {
  async findAll(
    filters: string | undefined,
    search: string | undefined,
    page: number = 1,
    limit: number = 10
  ): Promise<{ blog: BlogpostInterface[]; total_pages: number }> {
    const filter: any = {}

    // Define lookup, unwind, and addFields stages
    const aggregationStages: PipelineStage[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'userID',
          foreignField: '_id',
          as: 'user_blog'
        }
      },
      {
        $unwind: {
          path: '$user_blog',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          userName: { $ifNull: ['$user_blog.name', null] },
          userEmail: { $ifNull: ['$user_blog.email', null] },
          userProfile: { $ifNull: ['$user_blog.profile_info', null] }
        }
      },
      // Define project stage to include specified fields with ifNull
      {
        $project: {
          userName: { $ifNull: ['$userName', null] },
          userEmail: { $ifNull: ['$userEmail', null] },
          userProfile: { $ifNull: ['$userProfile', null] },
          title: 1,
          content: 1,
          likes: 1,
          dislikes: 1
        }
      }
    ]

    // Construct the initial filter based on search criteria
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { userProfile: { $regex: search, $options: 'i' } }
      ]
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

    // Add match, skip, and limit stages
    aggregationStages.push(
      { $match: filter },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    )

    // Execute the aggregation pipeline
    const blog = await BlogpostModel.aggregate(aggregationStages)

    // Count total documents for pagination
    const totalCount = await BlogpostModel.countDocuments(filter)
    const total_pages = Math.ceil(totalCount / limit)

    return { blog, total_pages }
  }
}
