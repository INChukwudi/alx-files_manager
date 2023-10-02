import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const indexRouter = express.Router();

// Status Route
indexRouter.get('/status', AppController.getStatus);

// Stats Route
indexRouter.get('/stats', AppController.getStats);

// Add user Route
indexRouter.post('/users', UsersController.postNew);

export default indexRouter;
