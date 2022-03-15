import * as mongodb from 'mongodb'
import * as assert from 'assert'
import { provided, xpath2object, css_p_class_inject } from './tool.js'

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

        {
            po.entities = await list_entity(db, colName)
            po.content = null

            po.entity = ""
            po.collections = []
            po.crossrefentities = []
            po.definition = ""
            po.expectedattributes = []
            po.identifier = ""
            po.legalDefinitions = []
        }

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

            console.log('--- NULL CONTENT ---')

            {
                po.content = null

                po.entity = "Couldn't find entity: " + value
                po.collections = []
                po.crossrefentities = []
                po.definition = ""
                po.expectedattributes = []
                po.identifier = ""
                po.legalDefinitions = []
            }
            fnReady(po, 404)

        } else {

            console.log('--- HAS CONTENT ---')

            {
                po.content = content

                if (provided(content.Entity)) {
                    po.entity = content.Entity
                } else {
                    po.entity = ""
                }

                if (provided(content.Collections)) {
                    po.collections = content.Collections

                    for (let i = 0; i < content.Collections.length; i++) {
                        if (!provided(content.Collections[i].Elements)) {
                            po.collections[i].Elements = []
                        }
                        if (!provided(content.Collections[i].BusinessRules)) {
                            po.collections[i].BusinessRules = []
                        }
                    }

                } else {
                    po.collections = []
                }

                if (provided(content.CrossrefEntities)) {
                    po.crossrefentities = content.CrossrefEntities
                } else {
                    po.crossrefentities = []
                }

                if (provided(content.Definition)) {
                    po.definition = css_p_class_inject(content.Definition, 'content')
                } else {
                    po.definition = ""
                }

                if (provided(content.ExpectedAttributes)) {
                    po.expectedattributes = content.ExpectedAttributes
                } else {
                    po.expectedattributes = []
                }

                if (provided(content.Identifier)) {
                    po.identifier = content.Identifier
                } else {
                    po.identifier = ""
                }

                if (provided(content.LegalDefinitions)) {
                    po.legalDefinitions = content.LegalDefinitions

                    for (let i = 0; i < content.LegalDefinitions.length; i++) {
                        if (provided(content.LegalDefinitions[i].Definition)) {
                            po.legalDefinitions[i].Definition = css_p_class_inject(content.LegalDefinitions[i].Definition, 'content')
                        }
                    }

                } else {
                    po.legalDefinitions = []
                }

            }
            fnReady(po, 200)

        }

        client.close()
    })
}