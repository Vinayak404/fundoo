/********************************************************************************************************
 * @Execution : default node : cmd> npm start
 * @Purpose : backend of user login using express node.js for Fundoo app
 * @description :Router for Notes related API's.
 * @overview :API's for backend.
 * @author : Vinayaka.S.V <vinayakavastrad@gmail.com> 
 * @version : 1.0
 * @since : 30/11/2019
 *********************************************************************************************************/
const notesController = require('../controller/notesController');
const verifyToken = require('../helpers/token');
const elastic = require('../helpers/elasticSearch');
const express = require('express');
const sns = require('../helpers/sns')
const imageMulter = require('../helpers/multer')
const notesRouter = express.Router();
notesRouter.post('/addNote', verifyToken.userVerify, notesController.addNote);
notesRouter.get('/getNotes', verifyToken.userVerify, notesController.getNotes);
notesRouter.put('/deleteNote', verifyToken.userVerify, notesController.deleteNote);
notesRouter.put('/editNote', verifyToken.userVerify, notesController.editNote);
notesRouter.put('/unTrash', verifyToken.userVerify, notesController.unTrash);
notesRouter.post('/collaborate', verifyToken.userVerify, notesController.collaborate);
notesRouter.post('/getCollaborators', verifyToken.userVerify, notesController.getCollaborators);
notesRouter.put('/deleteCollaborator', verifyToken.userVerify, notesController.deleteCollaborator);
notesRouter.put('/archive', verifyToken.userVerify, notesController.archive);
notesRouter.put('/unArchive', verifyToken.userVerify, notesController.unArchive);
notesRouter.post('/addReminder', verifyToken.userVerify, notesController.addReminder);
notesRouter.put('/deleteReminder', verifyToken.userVerify, notesController.deleteReminder);
notesRouter.post('/createIndex', verifyToken.userVerify, elastic.createIndex);
notesRouter.post('/search', verifyToken.userVerify, elastic.search);
notesRouter.put('/pin', verifyToken.userVerify, notesController.pin);
notesRouter.post('/createLabel', verifyToken.userVerify, notesController.createLabel);
notesRouter.put('/addLabel', verifyToken.userVerify, notesController.addLabel);
notesRouter.put('/removeLabel', verifyToken.userVerify, notesController.removeLabel);
notesRouter.get('/getLabels', verifyToken.userVerify, notesController.getLabels);
notesRouter.put('/editLabel', verifyToken.userVerify, notesController.editLabel);
notesRouter.delete('/deleteLabel', verifyToken.userVerify, notesController.deleteLabel);
notesRouter.get('/getArchives', verifyToken.userVerify, notesController.getArchives);
notesRouter.get('/getTrash', verifyToken.userVerify, notesController.getTrash);
notesRouter.put('/deleteNoteForever', verifyToken.userVerify, notesController.deleteNoteForever);
notesRouter.put('/color', verifyToken.userVerify, notesController.color);
notesRouter.get('/collaboratedNotes', verifyToken.userVerify, notesController.getCollaboratedNotes);
notesRouter.post('/noteImageUpload', verifyToken.userVerify, imageMulter.single('image'), notesController.NotesImageUpload)
module.exports = notesRouter;