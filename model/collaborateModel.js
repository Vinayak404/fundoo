/********************************************************************************************************
 * @Execution : default node : cmd> npm start
 * @Purpose : backend of user login using express node.js for Fundoo app
 * @description :Mongo DB model for Notes Collaborators.
 * @overview :API's for backend.
 * @author : Vinayaka.S.V <vinayakavastrad@gmail.com> 
 * @version : 1.0
 * @since : 30/11/2019
 *********************************************************************************************************/
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const collaborate = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    email: {
        type: String,
        required: true,
        ref: "user"
    },
    collaboratorsId: [{
        type: String,
        required: true,
        ref: "user"
    }],
    noteId: {
        type: Schema.Types.ObjectId,
        ref: "notes",
        required: true
    }
}, {
    timestamps: true
})
exports.collaborateModel = Mongoose.model("collaborateModel", collaborate)