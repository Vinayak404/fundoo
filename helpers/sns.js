let schedule = require('node-schedule')
const AWS = require('aws-sdk');
const services = require('../services/notesServices')
exports.reminderSchduler = () => {
    return new promise((resolve, reject) => {
        var date = new Date(2019, 11, 19, 10, 20);                          
        schedule.scheduleJob(date, () => {
            console.log("hiii");
            const msg = {
                "index": "hello",
                "name": "this is ur reminder"
            }
            this.notification(msg)
                .then((data) => {
                    console.log(data, "data");
                    resolve(data)
                })
                .catch((e) => {
                    console.log("err", e);
                    reject(e)

                })

        })
    })
}
exports.notification = (details) => {
    return new Promise((resolve, reject) => {
        console.log("notification", details.name);
        AWS.config.getCredentials(function (err,data) {
            if (err) console.log(err.stack),
                reject(err)
            // credentials not loaded
            else {
                console.log("Access key:", AWS.config.credentials.accessKeyId);
                console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
                resolve(data)
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

        publishTextPromise.then((data) =>{
                resolve(data)
                console.log(`message ${params.Message} send sent to the topic ${params.TopicArn}`);
                console.log("MessageID is ", data.MessageId);
            }).catch((err)=> {
                reject(err)
                console.error(err, err.stack);
            });
    })
}
const arr = {
    "index": "Vinayak",
    "name": "color"
}
// this.reminderSchduler()