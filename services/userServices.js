const model = require('../model/userModel')
exports.register = (req, callback) => {
    try {
        model.register(req, (err, data) => {
            if (err) callback(err);
            else callback(null, data)
        })
    } catch (e) {
        console.log(e);
    }
}
exports.login = (req, callback) => {
    try {
        model.login(req, (err, data) => {
            if (err) callback(err);
            else callback(null, data)
        })
    } catch (e) {
        console.log(e);
    }
}
exports.forgotPassword = (req, callback) => {
    try {
        model.forgotPassword(req, (err, data) => {
            if (err) callback(err)
            else callback(null, data)
        })
    } catch (e) {
        console.log(e);
    }
}
exports.resetPassword = (err, callback) => {
    try {
        model.resetPassword(req, (err, data) => {
            if (err) callback(err)
            else callback(null, data)
        })
    } catch (e) {
        console.log(e);
    }
}