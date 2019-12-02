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
        required: true
    }
}, {
    timestamps: true
})
exports.notesModel = mongoose.model('notes', notes)