import express from 'express';
import AppController from '../controllers/AppController';

const indexRouter = express.Router();

// Status Route
indexRouter.get('/status', AppController.getStatus);

// Stats Route
indexRouter.get('/stats', AppController.getStats);

export default indexRouter;
