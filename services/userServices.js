const model = require('../model/userModel')
const bcrypt = require('bcrypt')

exports.register = (req, callback) => {
    try {
        model.user.findOne({
            email: req.body.email
        }, (err, data) => {
            if (data) {
                callback("user already exists")
            } else {
                if (err) {
                    console.log('failed at model backend', err);

                } else {
                    bcrypt.hash(req.body.password, 10, (err, encrypted) => {
                        let user1 = new model.user({
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: encrypted
                        })
                        user1.save((err, data) => {
                            if (err) {
                                console.log('failed to save to db', err);
                                callback(err)
                            } else {
                                console.log('saved in the database', data);
                                callback(null, data);
                            }
                        })
                    })
                }
            }
        })

    } catch (e) {
        console.log(e);
    }
}
exports.login = (req, callback) => {
    try {
        model.user.findOne({
            email: req.body.email
        }, (err, data) => {
            if (data) {
                bcrypt.compare(req.body.password, data.password, (err, success) => {
                    if (success)
                        callback(null, data);
                    else
                        callback("password is incorrect", err);
                })
            } else callback(err, "user not in database");
        })
    } catch (e) {
        console.log(e);
    }
}
exports.forgotPassword = (req, callback) => {
    try {
        model.user.findOne({
            email: req.body.email
        }, (err, data) => {
            if (data) {
                callback(null, data)
                console.log(data);
            } else {
                callback(err)
                console.log("user not found!");
            }
        })
    } catch (e) {
        console.log(e);
    }
}
exports.resetPassword = (req, callback) => {
    try {
        bcrypt.hash(req.body.password, 10, (err, encrypted) => {
            if (err) {
                callback(err)
                console.log("error in salting!!");
            } else {
                model.user.updateOne({
                    _id: req.decoded.payload
                }, {
                    password: encrypted
                }, (err, data) => {
                    if (err) {
                        callback(err)
                        console.log("error in updating password!!");
                    } else {
                        callback(null, data)
                        console.log('updated password successfully!!', data);
                    }
                })
            }
        })
    } catch (e) {
        console.log(e);
    }
}