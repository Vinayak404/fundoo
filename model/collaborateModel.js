const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const collaborate = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    collaboratorsId: {
        type: [Mongoose.Schema.Types.ObjectId],
        required: true,
        ref: "user"
    },
    noteId: {
        type: Schema.Types.ObjectId,
        ref: "notes",
        required: true
    }
}, {
    timestamps: true
})
exports.collaborateModel = Mongoose.model("collaborateModel", collaborate)