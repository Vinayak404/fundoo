const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    hosts: ['http://127.0.0.1:9200/']
});


exports.createIndex = (req) => {
    try {
        let indexName = req.decoded.payload.id
        console.log("Index---->", indexName);
        client.indices.create({
            index: indexName
        }, (err, data) => {
            if (data) {
                console.log("result in index elastic search-->", data);
            } else {
                console.log("error in index", err);
            }
        })
    } catch (e) {
        console.log(e);
    }
}


exports.addDocument = (data1) => {
    try {
        let bulk = []
        console.log('in add doc!!');
        data1.forEach(element => {
            bulk.push({
                index: {
                    _index: element._userId,
                    _type: "notes"
                }
            });
            let data = {
                "id": element._id,
                "title": element.title,
                "description": element.description,
                "isDeleted": element.isDeleted,
                "isArchived": element.isArchived
            }
            bulk.push(data)
        });
        client.bulk({
            body: bulk
        }, (err, data) => {
            if (err) console.log("error in bulking");
            else console.log("successfully bulked", data);

        })

    } catch (e) {
        console.log(e);

    }
}

exports.search = (req, res) => {
    try {
        console.log("here in search", req.decoded.payload.id, "khjv", req.body.key);

        let userid = req.decoded.payload.id
        let body = {
            query: {
                query_string: {
                    query: `*${req.body.key}*`,
                    analyze_wildcard: true,
                    fields: ["title", "description", "isDeleted", "isArchived"]
                }
            }
        }
        client.search({
                index: userid,
                body: body,
                type: "notes"
            }).then((data) => {
                console.log(data)
                res.status(200).send(data)
            })
            .catch((err) => {
                console.log(err)
                res.status(404).send(err)
            })
    } catch (e) {
        console.log(e);
    }
}


exports.deleteDocument = (req) => {
    try {
        client.indices.delete({
            index: req.decoded.payload.id
        }, (err, data) => {
            if (data) {
                console.log("deleted doc successfully");
                this.createIndex(req)
            } else {
                console.log("error while deleting index");
            }
        })
    } catch (e) {
        console.log(e);
    }
}