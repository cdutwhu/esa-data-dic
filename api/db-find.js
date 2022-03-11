import * as mongodb from 'mongodb'
import * as assert from 'assert'

const MongoClient = mongodb.MongoClient

const dbName = 'dictionary'
const url = 'mongodb://127.0.0.1:27017'
// const url = 'mongodb://127.0.0.1:27017' + '/' + dbName

// const find_entity = async (db, colName, entity) => {
//     try {
//         await db.createCollection(colName)
//     } catch (err) {
//         if (err.codeName != 'NamespaceExists') {
//             return
//         }
//         console.log(`${err.codeName}, use existing collection - ${colName}`)
//     }
//     const col = db.collection(colName)
//     return col.findOne({ Entity: entity })
// }

const find_dic = async (db, colName, attr, value, ...out_attrs) => {
    try {
        await db.createCollection(colName)
    } catch (err) {
        if (err.codeName != 'NamespaceExists') {
            return
        }
        console.log(`${err.codeName}, use existing collection - ${colName}`)
    }
    const col = db.collection(colName)

    const query = {}
    query[attr] = value

    if (out_attrs.length == 0) {
        return col.findOne(query)
    }

    const out = {
        _id: 0
    }
    for (const oa of out_attrs) {
        out[oa] = true
    }
    console.log(out)
    return col.findOne(query, { projection: out })
}

MongoClient.connect(url, async (err, client) => {
    assert.equal(null, err)
    console.log("Connected successfully to server")

    const db = client.db(dbName) // create if not existing

    const colName = 'entity'
    const item = await find_dic(db, colName, 'Entity', 'Campus', 'Type', 'Collections')

    console.log(item)

    client.close()
})
