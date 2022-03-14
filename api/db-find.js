import * as mongodb from 'mongodb'
import * as assert from 'assert'
import { provided, xpath2object } from './tool.js'

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

const find_dic = async (db, colName, oneFlag, attr, value, ...out_attrs) => {
    try {
        await db.createCollection(colName)
    } catch (err) {
        if (err.codeName != 'NamespaceExists') {
            return
        }
        console.log(`${err.codeName}, use existing collection - ${colName}`)
    }
    const col = db.collection(colName)

    let query = {}
    if (attr !== '') {
        // regex for case insensitive
        const rVal = new RegExp('^' + value + '$', 'i')

        // make query object 
        // query = { [attr]: rVal }
        query = await xpath2object(attr, rVal)
    }
    console.log(query)

    if (out_attrs.length == 0) {
        if (oneFlag) {
            return col.findOne(query)
        } else {
            return col.find(query).toArray()
        }
    }

    const out = { _id: 0 }
    for (const oa of out_attrs) {
        out[oa] = true
    }
    console.log(out)

    if (oneFlag) {
        return col.findOne(query, { projection: out })
    } else {
        return col.find(query, { projection: out }).toArray()
    }
}

const list_entity = async (db, colName) => {
    let result = await find_dic(db, colName, false, '', '', 'Entity')
    const entities = []
    for (const item of result) {
        entities.push(item.Entity)
    }
    return entities
}

// referred by 'page-render.js'
// MongoClient.connect(url, async (err, client) => {
//     assert.equal(null, err)
//     console.log("Connected successfully to server")

//     const db = client.db(dbName) // create if not existing
//     const colName = 'entity'

//     // const item = await find_dic(db, colName, false, 'Entity', 'School', 'Type', 'Collections')
//     // const item = await find_dic(db, colName, false, '', '', 'Type', 'Entity', 'Collections')
//     // console.log(item)
//     // console.log(item.Collections[0].Elements[0])

//     const entities = await list_entity(db, colName)
//     console.log(entities)

//     client.close()
// })

export let po = {
    title: 'Education Data Dictionary',
    collections: [],
}

export const OnListEntity = async (fnReady) => {
    MongoClient.connect(url, async (err, client) => {
        assert.equal(null, err)
        console.log("Connected successfully to server")

        const db = client.db(dbName) // create if not existing
        const colName = 'entity'

        po.entities = await list_entity(db, colName)
        fnReady(po, 200)

        client.close()
    })
}

export const OnFindEntity = async (value, fnReady) => {
    MongoClient.connect(url, async (err, client) => {
        assert.equal(null, err)
        console.log("Connected successfully to server")

        const db = client.db(dbName) // create if not existing
        const colName = 'entity'

        const content = await find_dic(db, colName, true, 'Entity', value)
        if (content == null) {
            {
                po.entity = "Couldn't find entity: " + value
                po.collections = []
                po.mytest = 0
            }
            fnReady(po, 404)
        } else {
            {
                po.entity = content.Entity
                po.collections = content.Collections
                po.mytest = 10
            }
            fnReady(po, 200)
        }

        client.close()
    })
}