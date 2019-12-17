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
    labels: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "label"
    },
    reminder: {
        type: Date,
    }

}, {
    timestamps: true
})
exports.notesModel = mongoose.model('notes', notes)