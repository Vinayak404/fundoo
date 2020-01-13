/********************************************************************************************************
 * @Execution : default node : cmd> npm start
 * @Purpose : backend of user login using express node.js for Fundoo app
 * @description :MongoDB Model for Notes.
 * @overview :API's for backend.
 * @author : Vinayaka.S.V <vinayakavastrad@gmail.com> 
 * @version : 1.0
 * @since : 30/11/2019
 *********************************************************************************************************/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notes = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    pinned: {
        required: true,
        type: Boolean,
        default: false
    },
    labels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "label"
    }],
    reminder: {
        type: Date,
    },
    color: {
        type: String,
        default: "white"
    },
    collaboratorId: {
        type: Schema.Types.ObjectId,
        ref: "collaborateModel"
    }

}, {
    timestamps: true
})
exports.notesModel = mongoose.model('notes', notes)