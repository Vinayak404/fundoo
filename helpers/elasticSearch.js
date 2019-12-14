const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    hosts: ['http://127.0.0.1:9200/']
});

exports.createIndex = (req, res) => {
    let indexName = req.decoded.payload.id
    console.log("Index---->", indexName);
    client.indices.create({
        index: indexName
    }, (err, data) => {
        if (data) {
            console.log("result in index elastic search-->", data);
            res.status(200).send(data)
        } else {
            console.log("error in index", err);
        }
    })
}
