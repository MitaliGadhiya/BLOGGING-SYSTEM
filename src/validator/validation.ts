import * as yup from 'yup'

export const userSchema = yup.object().shape({
    name: yup.string().required('name is required'),
    email: yup
      .string()
      .email('invalid email-id')
      .required('email id is required'),
    password: yup.string().required('password must be required'),
    profile_info: yup.string().required('role is required')
  })

export const blogSchema = yup.object().shape({
    title: yup.string().required('title is required'),
    content: yup.string().required("content is required"),
    likes: yup.number().optional(),
    dislikes: yup.number().optional()
})

export const commentSchema = yup.object().shape({
    content : yup.string().required("content is required"),
    likes: yup.number().optional(),
    dislike: yup.number().optional()
})
