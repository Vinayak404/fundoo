const model = require('../model/notesModel')
const collabModel = require('../model/collaborateModel')
exports.addNote = (req) => {
    console.log(req.decoded);

    return new Promise((resolve, reject) => {
        let note = new model.notesModel({
            title: req.body.title,
            description: req.body.description,
            _userId: req.decoded.payload.id
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
            _userId: req.decoded.payload.id,
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
exports.collaborate = async (req) => {
    return await new Promise((resolve, reject) => {
        if (!req.decoded.payload.id == req.body.collabId) {
            collabModel.collaborateModel.findOne({
                noteId: req.body.noteId
            }, (err, data) => {
                if (err || data == null) {
                    let collab = new collabModel.collaborateModel({
                        userId: req.decoded.payload.id,
                        collaboratorsId: req.body.collabId,
                        noteId: req.body.noteId
                    });
                    collab.save((err, data) => {
                        if (data) resolve(data), console.log(data);
                        else reject(err), console.log(err);

                    })
                } else {
                    if (data.collaboratorsId.includes(req.body.collabId)) {
                        console.log('het data here', data);

                        reject('collab exits!!')
                    } else {
                        collabModel.collaborateModel.findOneAndUpdate({
                            noteId: req.body.noteId
                        }, {
                            $push: {
                                collaboratorsId: req.body.collabId
                            }
                        }, (err, data) => {
                            if (data) resolve(data)
                            else reject(err)
                        })
                    }
                }
            })
        } else reject("One cannot collaborate self!!")
    })
}