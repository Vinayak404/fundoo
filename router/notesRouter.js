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
notesRouter.post('/addReminder', verifyToken.userVerify, notesController.addReminder)
module.exports = notesRouter;