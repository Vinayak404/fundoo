const notesServices = require('../services/notesServices')
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
exports.collaborate = (req, res) => {
    try {
        req.checkBody('noteId', 'invalid model id').notEmpty();
        req.checkBody('collabId', 'invalid collab id').notEmpty();
        let error = req.validationErrors();
        let response = {}
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
                    res.status(422).send(response)
                })
        }

    } catch (e) {
        console.log(e);
    }
}