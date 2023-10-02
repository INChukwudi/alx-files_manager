import express from 'express';
import indexRouter from './routes/index';

const server = express();

server.use('/', indexRouter);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
