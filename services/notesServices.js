const model = require('../model/notesModel')
exports.addNote = (req) => {
    return new Promise((resolve, reject) => {
        let note = new model.notesModel({
            title: req.body.title,
            description: req.body.description,
            _userId: req.decoded.id
        });
        note.save((err, data) => {
            if (err) reject(err)
            else resolve(data)
        });
    })
}
exports.getNotes = (req) => {
    return new Promise((resolve, reject) => {
        model.notesModel.find({
            _userId: req.decoded.id,
            isDeleted: false
        }, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}
exports.deleteNote = (req) => {
    return new Promise((resolve, reject) => {
        model.notesModel.findByIdAndUpdate({
            _id: req.body._id
        }, {
            isDeleted: true
        }, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}
exports.editNote = (req) => {
    return new Promise((resolve, reject) => {
        model.notesModel.findByIdAndUpdate({
            _id: req.body._id
        }, {
            title: req.body.title,
            description: req.body.description
        }, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}