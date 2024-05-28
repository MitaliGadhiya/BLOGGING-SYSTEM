import { connect } from 'mongoose'
import { SUCCESS } from '../../utils/constant'
import { url } from '../../env'
import { boolean } from 'yup'

export class Connection {
  public async connections(): Promise<void> {
    return connect(url)
      .then(() => {
        console.log(SUCCESS)
      })
      .catch((error: Error) => {
        // throw error;
        console.log(error)
      })
  }
}
