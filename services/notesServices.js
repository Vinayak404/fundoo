const model = require('../model/notesModel')
const collabModel = require('../model/collaborateModel')
const redisCache = require('../helpers/redis')
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
            else {
                resolve(data)
                redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                    if (err) console.log('err in deleting cache');
                    else console.log('deleted the cached notes', data);


                })
            }
        });
    })
}


exports.getNotes = (req) => {
    return new Promise((resolve, reject) => {
        //checking for data in cache
        redisCache.getCacheNotes(req.decoded.payload.id, (err, data) => {
            if (data) resolve(data), console.log('data found in cache');

            else {
                //if cached data not found, check in database
                console.log('data not found in cache-->moving to database');

                model.notesModel.find({
                    _userId: req.decoded.payload.id,
                    isDeleted: false,
                    isArchived: false
                }, (err, data) => {
                    if (err) reject(err)
                    else {
                        resolve(data)
                        //take the data from database and add the same to the cache
                        let cacheNote = {}
                        cacheNote.id = req.decoded.payload.id;
                        cacheNote.notes = data
                        redisCache.cacheNotes(cacheNote, (err, data) => {
                            if (data) console.log('cached the notes');
                            else console.log("error in caching notes", err);


                        })
                    }
                })
            }
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
            else {
                resolve(data)
                redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                    if (err) console.log('err in deleting cache');
                    else console.log('deleted the cached notes', data);


                })
            }
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
            else {
                resolve(data)
                redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                    if (err) console.log('err in deleting cache');
                    else console.log('deleted the cached notes', data);


                })
            }
        })
    })
}


exports.archive = async (req) => {
    return await new Promise((resolve, reject) => {
        model.notesModel.findByIdAndUpdate({
            _id: req.body.id
        }, {
            isArchived: true
        }, (err, data) => {
            if (data) {
                resolve(data)
                redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                    if (err) console.log('err in deleting cache');
                    else console.log('deleted the cached notes', data);


                })
            } else reject(err)
        })
    })
}


exports.unArchive = async (req) => {
    return await new Promise((resolve, reject) => {
        model.notesModel.findByIdAndUpdate({
            _id: req.body.id
        }, {
            isArchived: false
        }, (err, data) => {
            if (data) {
                resolve(data)
                redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                    if (err) console.log('err in deleting cache');
                    else console.log('deleted the cached notes', data);


                })
            } else reject(err)
        })
    })
}


exports.addReminder = async (req) => {
    return await new Promise((resolve, reject) => {
        model.notesModel.findOneAndUpdate({
            _id: req.body.id
        }, {
            reminder: req.body.reminder
        }, (err, data) => {
            if (data) {
                resolve(data)
                redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                    if (err) console.log('err in deleting cache');
                    else console.log('deleted the cached notes', data);


                })
            } else reject(err)
        })
    })
}


exports.deleteReminder = async (req) => {
    return await new Promise((resolve, reject) => {
        model.notesModel.updateOne({
            _id: req.body.id
        }, {
            $unset: {
                reminder: ''
            }
        }, (err, data) => {
            if (err) reject(err)
            else {
                resolve(data)
                redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                    if (err) console.log('err in deleting cache');
                    else console.log('deleted the cached notes', data);


                })
            }
        })
    })
}


exports.collaborate = async (req) => {
    return await new Promise((resolve, reject) => {
        if (req.decoded.payload.id != req.body.collabId) {
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
        } else reject("One cannot collaborate self!!");
    })
}


exports.getCollaborators = async (req) => {
    return await new Promise((resolve, reject) => {
        collabModel.collaborateModel.findOne({
            noteId: req.body.noteId
        }, (err, data) => {
            if (err) reject(err)
            else resolve(data.collaboratorsId)
        })
    })
}


exports.deleteCollaborator = async (req) => {
    return await new Promise((resolve, reject) => {
        console.log(req.body);

        collabModel.collaborateModel.updateOne({
            noteId: req.body.noteId
        }, {
            $pull: {
                collaboratorsId: req.body.collabId
            }
        }, (err, data) => {
            if (data) resolve(data)
            else reject(err)
        })
    })
}