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
        type: Schema.Types.ObjectId,
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
    reminder: {
        type: Date,
    }

}, {
    timestamps: true
})
exports.notesModel = mongoose.model('notes', notes)