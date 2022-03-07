import * as mongodb from 'mongodb'
import * as assert from 'assert'

const MongoClient = mongodb.MongoClient

const dbName = 'dictionary'
const url = 'mongodb://127.0.0.1:27017'
// const url = 'mongodb://127.0.0.1:27017' + '/' + dbName

const find_entity = async (db, colName, entity) => {
    try {
        await db.createCollection(colName)
    } catch (err) {
        if (err.codeName != 'NamespaceExists') {
            return
        }
        console.log(`${err.codeName}, use existing collection - ${colName}`)
    }
    const col = db.collection(colName)
    return col.findOne({ Entity: entity })
}

MongoClient.connect(url, async (err, client) => {
    assert.equal(null, err)
    console.log("Connected successfully to server")

    const db = client.db(dbName) // create if not existing

    const colName = 'entity'
    const school = await find_entity(db, colName, 'School')

    console.log(school)

    client.close()
})
