/********************************************************************************************************
 * @Execution : default node : cmd> npm start
 * @Purpose : backend of user login using express node.js for Fundoo app
 * @description :MonGo DB modEL for Labels.
 * @overview :API's for backend.
 * @author : Vinayaka.S.V <vinayakavastrad@gmail.com> 
 * @version : 1.0
 * @since : 30/11/2019
 *********************************************************************************************************/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const label = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    name: {
        type: String,
        required: true
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "notes"
    }]
}, {
    timestamps: true
})
exports.labelModel = mongoose.model('label', label)