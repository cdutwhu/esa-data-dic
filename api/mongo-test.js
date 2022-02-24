import * as mongodb from 'mongodb'
import * as assert from 'assert'

const MongoClient = mongodb.MongoClient
const url = 'mongodb://127.0.0.1:27017'

MongoClient.connect(url, async (err, client) => {
    assert.equal(null, err)
    console.log("Connected successfully to server")

    const db = client.db('komablog')

    const colName = 'AAA'

    try {
        await db.createCollection(colName)
    } catch (err) {
        if (err.codeName != 'NamespaceExists') {
            client.close()
            return
        }
        console.log(err.codeName)
    }

    const col = db.collection(colName)

    for (let i = 0; i < 10; i++) {
        const idx = i.toString()
        let obj = {
            [idx]: i, // [key variable]
            idx: i,   // key literal 
        }
        await col.insertOne(obj)
    }

    client.close()
})
