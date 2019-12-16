const notesServices = require('../services/notesServices')
const elastic = require('../helpers/elasticSearch')
exports.addNote = (req, res) => {
    console.log(req.decoded);

    req.checkBody('title', "Enter valid title").notEmpty();
    req.checkBody('description', "Enter valid description").notEmpty()
    let error = req.validationErrors();
    let response = {};
    if (error) {
        response.success = false;
        response.error = error;
        res.status(404).send(response)
    } else {
        notesServices.addNote(req)
            .then((data) => {
                response.success = true;
                response.data = data
                res.status(200).send(response)
            }).catch((err) => {
                response.success = false;
                response.error = err;
                res.status(500).send(response)
            })
    }
}
exports.getNotes = (req, res) => {
    try {
        let response = {}
        notesServices.getNotes(req)
            .then((data) => {
                response.success = true;
                response.data = data
                res.status(200).send(response)
                elastic.addDocument(data, (err, data) => {
                    if (data) console.log("added to elastic successfully");
                    else console.log("fails to add to elastic");
                })
            }).catch((err) => {
                response.success = false;
                response.error = err;
                res.status(500).send(response)
            })
    } catch (e) {
        console.log(e);

    }
}
exports.deleteNote = (req, res) => {
    try {
        let response = {};
        notesServices.deleteNote(req)

            .then((data) => {
                response.success = true;
                response.data = data;
                res.status(200).send(response);
            }).catch((err) => {
                response.success = false;
                response.error = err;
                res.status(500).send(response)
            })
    } catch (e) {
        console.log(e);

    }
}
exports.editNote = (req, res) => {
    try {
        let response = {};
        notesServices.editNote(req)
            .then((data) => {
                response.success = true;
                response.data = data;
                res.status(200).send(response);
            }).catch((err) => {
                response.success = true;
                response.err = err;
                res.status(500).send(response);
            })
    } catch (e) {
        console.log(e);
    }
}
exports.archive = (req, res) => {
    try {
        let response = {};
        notesServices.archive(req)
            .then((data) => {
                response.success = true;
                response.data = data;
                res.status(200).send(response);
            }).catch((err) => {
                response.success = false;
                response.err = err;
                res.status(500).send(response);
            })
    } catch (e) {
        console.log(e);

    }
}
exports.unArchive = (req, res) => {
    try {
        let response = {};
        notesServices.unArchive(req)
            .then((data) => {
                response.success = true;
                response.data = data;
                res.status(200).send(response);
            }).catch((err) => {
                response.success = true;
                response.err = err;
                res.status(500).send(response);
            })
    } catch (e) {
        console.log(e);
    }
}
exports.addReminder = (req, res) => {
    try {
        let response = {};
        notesServices.addReminder(req)
            .then((data) => {
                response.success = true;
                response.data = data;
                res.status(200).send(response);
            }).catch((err) => {
                response.success = false;
                response.error = err;
                res.status(422).send(response);
            })

    } catch (e) {
        console.log(e);
    }
}

exports.deleteReminder = (req, res) => {
    try {
        let response = {};
        notesServices.deleteReminder(req)
            .then((data) => {
                response.success = true;
                response.data = data;
                res.status(200).send(response);
            }).catch((err) => {
                response.success = false;
                response.error = err;
                res.status(422).send(response);
            })

    } catch (e) {
        console.log(e);
    }
}


exports.collaborate = (req, res) => {
    try {
        req.checkBody('noteId', 'invalid model id').notEmpty();
        req.checkBody('collabId', 'invalid collab id').notEmpty();
        let error = req.validationErrors();
        let response = {};
        if (error) {
            response.success = false;
            response.err = error
            res.status(400).send(response);
        } else {
            notesServices.collaborate(req)
                .then((data) => {
                    response.success = true;
                    response.data = data;
                    res.status(200).send(response);
                }).catch((err) => {
                    response.success = false;
                    response.error = err;
                    res.status(422).send(response);
                })
        }
    } catch (e) {
        console.log(e);
    }
}
exports.getCollaborators = (req, res) => {
    try {
        let response = {};
        notesServices.getCollaborators(req)
            .then((data) => {
                response.data = data;
                response.success = true;
                res.status(200).send(response)
            })
            .catch((err) => {
                response.success = false;
                response.error = err;
                res.status(404).send(response)
            })
    } catch (e) {
        console.log(e)
    };
}
exports.deleteCollaborator = (req, res) => {
    try {
        let response = {};
        notesServices.deleteCollaborator(req)
            .then((data) => {
                response.data = data;
                response.success = true;
                res.status(200).send(response)
            }).catch((err) => {
                response.err = err;
                response.success = false
                res.status(404).send(response)
            })
    } catch (e) {
        console.log(e);
    }
}