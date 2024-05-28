import 'reflect-metadata';
import express from 'express';
import { Connection } from './config/db/connection';
import cookieParser from 'cookie-parser';
import { InversifyExpressServer } from 'inversify-express-utils';
import container from './config/inversyfi.config';
import { port, apiKey } from './env';
import cors from 'cors';
import axios from 'axios';
import swaggerUi from 'swagger-ui-express'
import swagger from './swagger.json'


const db = new Connection();
db.connections();


class PostmanClient {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCollections() {
    try {
      const response = await axios.get('https://api.getpostman.com/collections', {
        headers: {
          'X-Api-Key': this.apiKey
        }
      });
      return response.data.collections;
    } catch (error) {
      throw new Error(`Error fetching collections: ${error.message}`);
    }
  }
}


const server = new InversifyExpressServer(container);
server.setConfig(app => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));
});


const client = new PostmanClient(apiKey);
client.getCollections()
  .catch(error => {
    console.error(error.message);
  });


const app = server.build();
app.listen(port, (): void => {
  console.log(`Server is running at port ${port}`);
});
