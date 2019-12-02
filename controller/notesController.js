const notesServices = require('../services/notesServices')
exports.addNote = (req, res) => {
    req.checkBody('title', "Enter valid title").notEmpty();
    req.checkBody('description', "Enter valid description").notEmpty()
    let error = req.validationErrors();
    let response = {};
    if (error) {
        response.succcess = false;
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