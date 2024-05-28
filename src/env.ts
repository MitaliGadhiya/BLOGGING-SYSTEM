import dotenv from 'dotenv'


dotenv.config()
export const port = process.env.PORT || 8000
export const secretkey = process.env.SECRETKEY || ''
export const url = process.env.URL || ''
export const apiKey = process.env.APIKEY || ''