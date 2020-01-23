const model = require('../model/userModel')
const bcrypt = require('bcrypt')
const emailExistence = require('email-existence')
const logger = require('../helpers/logger')
exports.register = (req, callback) => {
    try {
        model.user.findOne({
            email: req.body.email
        }, (err, data) => {
            if (data) {
                callback("user already exists")
            } else {
                emailExistence(req.body.email, (err, data) => {
                    if (!data) callback('email invalid!')
                    else {
                        bcrypt.hash(req.body.password, 10, (err, encrypted) => {
                            let user1 = new model.user({
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                email: req.body.email,
                                password: encrypted
                            })
                            user1.save((err, data) => {
                                if (err) {
                                    logger.ExpressServerLogger.error('failed to save to db', err);
                                    callback(err)
                                } else {
                                    logger.ExpressServerLogger.info('saved in the database', data);
                                    callback(null, data);
                                }
                            })
                        })
                    }
                })
            }
        })
    } catch (e) {
        logger.ExpressServerLogger.error(e);
    }
}
exports.login = (req, callback) => {
    try {
        model.user.findOne({
            email: req.body.email
        }, (err, data) => {
            if (data) {
                console.log(data);

                bcrypt.compare(req.body.password, data.password, (err, data1) => {
                    if (data1) {

                        callback(null, data);

                    } else {
                        callback('password is wrong');
                    }
                })
            } else callback('user does not exist');
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
                console.log("error in salting!!", req.decoded.payload, 'id reset');
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
exports.uploadImage = (req, imageURL, callback) => {
    console.log("IMGE------>>>>>>>", imageURL);
    console.log('userid as', req.decoded.payload.id);
    model.user.findOne({
        "_id": req.decoded.payload.id
    }, (error, data) => {
        if (error) {
            callback(error)
        } else {
            model.user.updateOne({
                _id: req.decoded.payload.id
            }, {
                imageURL: imageURL
            }, (err, data) => {
                if (err) {
                    callback(err)
                } else {
                    callback(null, data)
                }
            })
        }
    })
}