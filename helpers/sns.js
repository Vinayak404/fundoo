let schedule = require('node-schedule')
const AWS = require('aws-sdk');
const services = require('../services/notesServices')
exports.reminderSchduler = (req) => {
    let details;
    console.log("req", req);
    return new promise((resolve, reject) => {
        var date = new Date(2019, 11, 19, 23, 0);
        let rem = schedule.scheduleJob(date, () => {
            console.log("hiii");
            const msg = {
                "index": "hello",
                "name": "this is ur reminder"
            }
            this.notification(msg)
                .then((data) => {
                    console.log(data, "data");
                })
                .catch((e) => {
                    console.log("err", e);

                })

        })
    })
}
reminderSchduler()
exports.notification = (details) => {
    console.log(process.env.AWS_REGION);

    return new Promise((resolve, reject) => {

        console.log("notification", details.name);

        AWS.config.getCredentials(function (err) {
            if (err) console.log(err.stack);
            // credentials not loaded
            else {
                console.log("Access key:", AWS.config.credentials.accessKeyId);
                console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
            }
        });
        AWS.config.update({
            region: process.env.AWS_REGION
        });

        let params = {
            Message: `You have a reminder : ${details.name} and title : ${details.index}`,
            /* required */
            TopicArn: process.env.AWS_TOPIC_ARN
        };

        let publishTextPromise = new AWS.SNS().publish(params).promise();

        publishTextPromise.then(
            function (data) {
                resolve(data)
                console.log(`message ${params.Message} send sent to the topic ${params.TopicArn}`);
                console.log("MessageID is ", data.MessageId);
            }).catch(
            function (err) {
                reject(err)
                console.error(err, err.stack);
            });
    })
}
const arr = {
    "index": "Vinayak",
    "name": "color"
}
this.notification(arr);