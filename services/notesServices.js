const model = require('../model/notesModel')
const collabModel = require('../model/collaborateModel')
const redisCache = require('../helpers/redis')
const elastic = require('../helpers/elasticSearch')
const labelModel = require('../model/labelModel')
exports.addNote = (req) => {
    try {
        console.log(req.decoded);
        return new Promise((resolve, reject) => {
            let note = new model.notesModel({
                title: req.body.title,
                description: req.body.description,
                _userId: req.decoded.payload.id,
                isArchived: req.body.archive,
                pinned: req.body.pin,
                labels: req.body.label,
                color: req.body.color,
                reminder: req.body.reminder
            });
            note.save((err, data) => {
                if (err) reject(err)
                else {
                    resolve(data)
                    elastic.deleteDocument(req)
                    redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                        if (err) console.log('err in deleting cache');
                        else console.log('deleted the cached notes', data);
                    })
                }
            });
        })
    } catch (e) {
        console.log(e);
    }
}


exports.getNotes = (req) => {
    try {
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
                    }).populate('label').exec((err, data) => {
                        if (data) {
                            resolve(data)
                            //take the data from database and add the same to the cache
                            let cacheNote = {}
                            cacheNote.id = req.decoded.payload.id;
                            cacheNote.notes = data
                            redisCache.cacheNotes(cacheNote, (err, data) => {
                                if (data) console.log('cached the notes');
                                else console.log("error in caching notes", err);
                            })
                        } else {
                            reject(err)
                        }

                    })

                }
            })


        })
    } catch (e) {
        console.log(e);
    }
}


exports.deleteNote = (req) => {
    try {
        return new Promise((resolve, reject) => {

            model.notesModel.findByIdAndUpdate({
                _id: req.body._id
            }, {
                isDeleted: true
            }, (err, data) => {
                if (err) reject(err)
                else {
                    resolve(data)
                    console.log("PAyLoad", data, req.decoded.payload);
                    elastic.deleteDocument(req)
                    console.log("PAyLoad", req.decoded.payload);

                    redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                        if (err) console.log('err in deleting cache');
                        else console.log('deleted the cached notes', data);
                    })
                }
            })
        })
    } catch (e) {
        console.log(e);
    }
}


exports.editNote = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            model.notesModel.findByIdAndUpdate({
                _id: req.body._id
            }, {
                title: req.body.title,
                description: req.body.description
            }, (err, data) => {
                if (err) reject(err)
                else {
                    resolve(data)
                    elastic.deleteDocument(req)
                    redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                        if (err) console.log('err in deleting cache');
                        else console.log('deleted the cached notes', data);
                    })
                }
            })
        })
    } catch (e) {
        console.log(e);
    }
}


exports.archive = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            model.notesModel.findByIdAndUpdate({
                _id: req.body.id
            }, {
                isArchived: true
            }, (err, data) => {
                if (data) {
                    resolve(data)
                    elastic.deleteDocument(req)
                    redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                        if (err) console.log('err in deleting cache');
                        else console.log('deleted the cached notes', data);
                    });
                } else reject(err)
            })
        })
    } catch (e) {
        console.log(e);
    }
}


exports.unArchive = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            model.notesModel.findByIdAndUpdate({
                _id: req.body.id
            }, {
                isArchived: false
            }, (err, data) => {
                if (data) {
                    resolve(data)
                    elastic.deleteDocument(req)
                    redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                        if (err) console.log('err in deleting cache');
                        else console.log('deleted the cached notes', data);
                    })
                } else reject(err)
            })
        })
    } catch (e) {
        console.log(e);
    }
}


exports.addReminder = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            model.notesModel.findOneAndUpdate({
                _id: req.body.id
            }, {
                reminder: req.body.reminder
            }, (err, data) => {
                if (data) {
                    resolve(data)
                    elastic.deleteDocument(req)
                    redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                        if (err) console.log('err in deleting cache');
                        else console.log('deleted the cached notes', data);
                    })
                } else reject(err)
            })
        })
    } catch (e) {
        console.log(e);
    }
}


exports.deleteReminder = async (req) => {
    try {
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
                    elastic.deleteDocument(req)
                    redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                        if (err) console.log('err in deleting cache');
                        else console.log('deleted the cached notes', data);
                    })
                }
            })
        })
    } catch (e) {
        console.log(e);
    }
}


exports.collaborate = async (req) => {
    try {
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
                            if (data) {
                                resolve(data), console.log(data), elastic.deleteDocument(req)
                                redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                                    if (err) console.log('err in deleting cache');
                                    else console.log('deleted the cached notes', data);
                                })
                            } else reject(err), console.log(err);
                        })
                    } else {
                        if (data.collaboratorsId.includes(req.body.collabId)) {
                            console.log(' data here', data);

                            reject('collab exits!!')
                        } else {
                            collabModel.collaborateModel.findOneAndUpdate({
                                noteId: req.body.noteId
                            }, {
                                $push: {
                                    collaboratorsId: req.body.collabId
                                }
                            }, (err, data) => {
                                if (data) {
                                    resolve(data)
                                    elastic.deleteDocument(req)
                                    redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                                        if (err) console.log('err in deleting cache');
                                        else console.log('deleted the cached notes', data);
                                    })
                                } else reject(err)
                            })
                        }
                    }
                })
            } else reject("One cannot collaborate self!!");
        })
    } catch (e) {
        console.log(e);
    }
}


exports.getCollaborators = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            collabModel.collaborateModel.findOne({
                noteId: req.body.noteId
            }, (err, data) => {
                if (err) reject(err)
                else resolve(data.collaboratorsId)
            })
        })
    } catch (e) {
        console.log(e);
    }
}



exports.deleteCollaborator = async (req) => {
    try {
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
    } catch (e) {
        console.log(e);
    }
}


exports.pin = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            model.notesModel.findOne({
                    _id: req.body.id,
                    _userId: req.decoded.payload.id
                },
                (err, data) => {
                    if (err || !data) reject(err)
                    else {
                        console.log(data, req.decoded.payload.id);

                        if (data.pinned == false) {
                            model.notesModel.updateOne({
                                _id: req.body.id,
                                _userId: req.decoded.payload.id
                            }, {
                                pinned: true
                            }, (err, data) => {
                                if (err) reject(err)
                                else resolve(data), console.log("data---->", data);

                            })
                        } else {
                            model.notesModel.updateOne({
                                _id: req.body.id,
                                _userId: req.decoded.payload.id
                            }, {
                                pinned: false
                            }, (err, data) => {
                                if (err) reject(err)
                                else resolve(data), console.log("data---->", data);
                            })
                        }
                    }
                })
        })
    } catch (e) {
        console.log(e)
    };
}

exports.createLabel = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            let newLabel = new labelModel.labelModel({
                _userId: req.decoded.payload.id,
                name: req.body.name
            })
            newLabel.save((err, data) => {
                if (err) reject(err)
                else {
                    resolve(data)
                    elastic.deleteDocument(req)
                    redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                        if (err) console.log('err in deleting cache');
                        else console.log('deleted the cached notes', data);
                    })
                }
            });
        })
    } catch (e) {
        console.log(e);
    }
}
exports.getLabels = async (req) => {
    return await new Promise((resolve, reject) => {
        labelModel.labelModel.find({
                _userId: req.decoded.payload.id
            }).populate('notes')
            .then((data) => {
                resolve(data)
                console.log((data));

            })
            .catch((e) => {
                reject(err);

            })

    })
}

exports.editLabel = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            console.log(req.decoded.payload.id);

            labelModel.labelModel.findOneAndUpdate({
                _id: req.body.id,
                _userId: req.decoded.payload.id
            }, {
                name: req.body.name
            }, (err, data) => {
                if (err || !data) reject(err)
                else resolve(data)
            })
        })
    } catch (e) {
        console.log(e);
    }
}

exports.deleteLabel = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            labelModel.labelModel.findOneAndDelete({
                _id: req.body.id,
                _userId: req.decoded.payload.id
            }, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    } catch (e) {
        console.log(e);
    }
}

exports.addLabel = async (req) => {
    return await new Promise((resolve, reject) => {
        model.notesModel.findById({
            _id: req.body.noteId
        }, (err, data) => {
            if (err || !data) reject(err)
            else {
                if (!data.labels.includes(req.body.labelId)) {
                    model.notesModel.findByIdAndUpdate({
                        _id: req.body.noteId,
                        _userId: req.decoded.payload.id
                    }, {
                        $push: {
                            labels: req.body.labelId
                        }
                    }, (err, data) => {
                        if (data) {
                            labelModel.labelModel.findByIdAndUpdate({
                                _id: req.body.labelId,
                                _userId: req.decoded.payload.id
                            }, {
                                $push: {
                                    notes: req.body.noteId
                                }
                            }, (err, data) => {
                                if (data) {
                                    resolve(data)
                                    elastic.deleteDocument(req)
                                    redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                                        if (err) console.log('err in deleting cache');
                                        else console.log('deleted the cached notes', data);
                                    })
                                } else reject(err)
                            })
                        } else reject(err)
                    })
                } else reject("already labeled")
            }
        })
    })
}

exports.removeLabel = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            model.notesModel.findById({
                _id: req.body.noteId
            }, (err, data) => {
                if (err || !data) reject(err)
                else {
                    if (data.labels.includes(req.body.labelId)) {
                        model.notesModel.findByIdAndUpdate({
                            _id: req.body.noteId,
                            _userId: req.decoded.payload.id
                        }, {
                            $pull: {
                                labels: req.body.labelId
                            }
                        }, (err, data) => {
                            if (err) reject(err)
                            else {
                                resolve(data)
                                elastic.deleteDocument(req)
                                redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                                    if (err) console.log('err in deleting cache');
                                    else console.log('deleted the cached notes', data);
                                })
                            }
                        })
                    }
                }
            })
        })
    } catch (e) {
        console.log(e);
    }
}
exports.getArchives = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            model.notesModel.find({
                _userId: req.decoded.payload.id,
                isDeleted: false,
                isArchived: true
            }, (err, data) => {
                if (data) resolve(data)
                else reject(err)
            })
        })
    } catch (e) {
        console.log(e);

    }
}
exports.getTrash = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            model.notesModel.find({
                _userId: req.decoded.payload.id,
                isDeleted: true
            }, (err, data) => {
                if (data) resolve(data)
                else reject(err)
            })
        })
    } catch (e) {
        console.log(e);

    }
}

exports.deleteNoteForever = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            console.log(req.body, "jfhf", req.decoded.payload.id);

            model.notesModel.findOneAndDelete({
                _id: req.body._id,
                _userId: req.decoded.payload.id
            }, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    } catch (e) {
        console.log(e);
    }
}
exports.color = async (req) => {
    try {
        return await new Promise((resolve, reject) => {
            console.log(req.body, "jfrhahf", req.decoded.payload.id)
            model.notesModel.findByIdAndUpdate({
                _id: req.body.id
            }, {
                color: req.body.color
            }, (err, data) => {
                if (data) {
                    resolve(data)
                    elastic.deleteDocument(req)
                    redisCache.deCacheNote(req.decoded.payload.id, (err, data) => {
                        if (err) console.log('err in deleting cache');
                        else console.log('deleted the cached notes', data);
                    });
                } else reject(err)
            })
        })
    } catch (e) {
        console.log(e);
    }
}
exports.getCollaboratedNotes = (req) => {
    try {
        new Promise((resolve, reject) => {
            collabModel.collaborateModel.find({}, (err, data) => {
                if (data) {
                    console.log("daTa", data);

                    var dataArr = [];
                    // data.forEach(async (e) => {
                    //     if (e.collaboratorsId.includes(req.decoded.payload.id)) {
                    //         model.notesModel.find({
                    //             _id: e.noteId
                    //         }, (err, data) => {
                    //             console.log("DaTa", data)
                    //             if (data) {
                    //                 console.log("noTEDAtA", data);
                    //                 dataArr.push(data)
                    //                 console.log("JREH RTF", dataArr);
                    //             } else console.log("ERTGBG", err);
                    //         })
                    //     }
                    // })
                    data.forEach(e => {
                        if (e.collaboratorsId.includes(req.decoded.payload.id)) {
                            dataArr.push(e.noteId)
                        }
                    })
                    console.log("DataAARR", dataArr);
                    let not = []
                    for (i of dataArr) {
                        model.notesModel.findOne({
                            _id: i
                        }, (err, data) => {
                            if (data) not.push(data)
                        })
                    }
                    console.log("woohoo", not);

                    resolve(not)
                } else reject(err);
            })
        })
    } catch (e) {
        console.log(e);
    }
}