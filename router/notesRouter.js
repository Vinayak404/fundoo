/********************************************************************************************************
 * @Execution : default node : cmd> npm start
 * @Purpose : backend of user login using express node.js for Fundoo app
 * @description :using express framework and connect socket.
 * @overview :API's for backend.
 * @author : Vinayaka.S.V <vinayakavastrad@gmail.com> 
 * @version : 1.0
 * @since : 30/11/2019
 *********************************************************************************************************/
const notesController = require('../controller/notesController');
const verifyToken = require('../helpers/token');
const express = require('express');
const notesRouter = express.Router();
notesRouter.post('/addNote', verifyToken.userVerify, notesController.addNote);
notesRouter.get('/getNotes', verifyToken.userVerify, notesController.getNotes);
notesRouter.put('/deleteNote', notesController.deleteNote);
notesRouter.put('/editNote', notesController.editNote);
notesRouter.post('/collaborate', verifyToken.userVerify, notesController.collaborate);
notesRouter.get('/getCollaborators', verifyToken.userVerify, notesController.getCollaborators);
notesRouter.put('/deleteCollaborator', verifyToken.userVerify, notesController.deleteCollaborator);
notesRouter.put('/archive', verifyToken.userVerify, notesController.archive);
notesRouter.put('/unArchive', verifyToken.userVerify, notesController.unArchive);
notesRouter.post('/addReminder', verifyToken.userVerify, notesController.addReminder);
notesRouter.put('/deleteReminder', verifyToken.userVerify, notesController.deleteReminder);
module.exports = notesRouter;