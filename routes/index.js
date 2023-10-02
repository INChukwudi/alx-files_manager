import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const indexRouter = express.Router();

// Status Route
indexRouter.get('/status', AppController.getStatus);

// Stats Route
indexRouter.get('/stats', AppController.getStats);

// Add user Route
indexRouter.post('/users', UsersController.postNew);

// User Login Route
indexRouter.get('/connect', AuthController.getConnect);

// User Logout Route
indexRouter.get('/disconnect', AuthController.getDisconnect);

// User Information Route
indexRouter.get('/users/me', UsersController.getMe);

// File Upload Route
indexRouter.post('/files', FilesController.postUpload);

// Get User File By Id Route
indexRouter.get('/files/:id', FilesController.getShow);

// Get User Files
indexRouter.get('/files', FilesController.getIndex);

export default indexRouter;
