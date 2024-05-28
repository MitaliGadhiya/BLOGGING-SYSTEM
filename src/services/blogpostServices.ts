import { BlogpostInterface, UserInterface } from '../interface'
import { BlogpostModel, UserModel } from '../models'
import { injectable } from 'inversify'
import puppeteer from 'puppeteer'

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

  async updateBlog(
    _id: string,
    update: any,
    updateBlog: Partial<BlogpostInterface>
  ): Promise<BlogpostInterface | object> {
    const result = await BlogpostModel.findOne({ _id: _id, isdeleted: false })
    const uid = result.userID
    const userID = update._id

    if (!result) {
      const message = { message: 'blog post is not found' }
      return message
    }
    if (
      result &&
      uid.toString() === userID &&
      (update.role === 'admin' || update.role === 'author')
    ) {
      await BlogpostModel.findByIdAndUpdate(_id, updateBlog, { new: true })
      const message = { message: 'BLOG SUCCESSFULLY UPDATED' }
      return message
    } else {
      const message = { message: "you can not other's post update" }
      return message
    }
  }

  async deleteBlog(
    _id: string,
    delete1: any
  ): Promise<BlogpostInterface | object> {
    const result: BlogpostInterface | null = await BlogpostModel.findOne({
      _id: _id,
      isdeleted: false
    })
    const userId = delete1._id
    const uid = result.userID
    if (
      (result && uid === userId && delete1.role === 'author') ||
      delete1.role === 'admin'
    ) {
      await BlogpostModel.findByIdAndUpdate(_id, { isdeleted: true })
      const mesage = { message: 'BLOG SUCCESFULLY DELETED' }
      return mesage
    } else {
      const message = { message: "You cannot delete other's post" }
      return message
    }
  }

  async findAll(_id: string): Promise<void | object> {
    const find = await BlogpostModel.findOne({ _id: _id })
    return find
  }

  async generatePdf():Promise<any> {
    const users = await BlogpostModel.find();
  
    const browser = await puppeteer.launch({
      headless: true, // run in headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // necessary for some environments
    });
    const page = await browser.newPage();
  
    // Generate HTML content
    let content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>User Data</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 10px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <h1>User Data</h1>
          <table>
            <thead>
              <tr>
                <th>BLOGID</th>
                <th>title</th>
                <th>content</th>
                <th>userID</th>
                <th>likes</th>
                <th>dislikes</th>
              </tr>
            </thead>
            <tbody>
    `;
  
    users.forEach(user => {
      content += `
        <tr>
          <td>${user._id}</td>
          <td>${user.title}</td>
          <td>${user.content}</td>
          <td>${user.userID}</td>
          <td>${user.likes}</td>
          <td>${user.dislikes}</td>
        </tr>
      `;
    });
  
    content += `
            </tbody>
          </table>
        </body>
      </html>
    `;
  
    await page.setContent(content, { waitUntil: 'networkidle0' });
  
    await page.pdf({
      path: 'users.pdf',
      format: 'A4',
      printBackground: true,
    });
  
    await browser.close();
  }
}
