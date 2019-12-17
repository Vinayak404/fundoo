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
    }
}, {
    timestamps: true
})
exports.labelModel = mongoose.model('label', label)