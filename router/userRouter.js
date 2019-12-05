const userController = require('../controller/userController');
const verifyToken = require('../middleware/token');
const express = require('express');
const router = express.Router();
const upload = require('../services/fileUploadServices');
let singleUpload = upload.single('image');
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword/:token', verifyToken.verify, userController.resetPassword);
router.post('/uploadImage', verifyToken.userVerify, (req, res, next) => {
    // console.log('req', req);
    singleUpload(req, res, (err) => {
        console.log("req.file", req.file);
        let imageURL = req.file.location;
        console.log("image URL", imageURL);
        req.imageURL = imageURL;
        next();
    });
}, userController.uploadImage);
module.exports = router;