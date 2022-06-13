import express, { Express, Request, Response } from 'express';

// import router from './src/routes'
import createSocket from './src/socket'
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// app.use(router);

const server = createSocket(app)

// app.listen(port, () => {
//   console.log(`CHAT Server is running at http://localhost:${port}`);
// });

server.listen(port,() => console.log(`CHAT Listening on port ${port}`))