const model = require('../model/notesModel')
exports.addNote = (req) => {
    return new Promise((resolve, reject) => {
        let note = new model.notesModel({
            title: req.body.title,
            description: req.body.description,
            id: req.body.id
        });
        note.save((err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}