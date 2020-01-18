/********************************************************************************************************
 * @Execution : default node : cmd> npm start
 * @Purpose : backend of user login using express node.js for Fundoo app
 * @description :using express framework and connect socket.
 * @overview :AWS Bucket Implementation for storing profile pictures.
 * @author : Vinayaka.S.V <vinayakavastrad@gmail.com> 
 * @version : 1.0
 * @since : 30/11/2019
 *********************************************************************************************************/
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID
});

const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.BUCKET_NAME,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, {
                fieldName: 'TESTING_META_DATA!'
            });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})

module.exports = upload