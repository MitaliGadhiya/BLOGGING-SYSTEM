import { Container } from 'inversify'
import { TYPES } from '../utils/types'
import * as controller from '../controller'
import * as services from '../services'
import * as query from '../query'
import { Auth } from '../middleware/auth'

//container
const container = new Container()

//query
for (const i in query) {
  const Query = query[i]
  container.bind<typeof Query>(TYPES[Query.name]).to(Query)
}

//middleware
container.bind<Auth>(Auth).toSelf()

//controller
for (const i in controller) {
  const Controller = controller[i]
  console.log(Controller)
  container.bind<typeof Controller>(TYPES[Controller.name]).to(Controller)
}

//services
for (const i in services) {
  const Services = services[i]
  container.bind<typeof Services>(TYPES[Services.name]).to(Services)
}

export default container
