import * as ejs from 'ejs'
import * as fs from 'fs'
import { po, OnFindEntity, OnListEntity } from './db-find.js'

const template = fs.readFileSync('./www/dictionary.ejs', 'utf-8')

const render_ejs = (po, code) => {

    const data = ejs.render(template, {
        title: po.title,
        entities: po.entities,
        content: po.content,
        entity: po.entity,
        collections: po.collections,
        crossrefentities: po.crossrefentities,
        definition: po.definition,
        expectedattributes: po.expectedattributes,
        identifier: po.identifier,
        legalDefinitions: po.legalDefinitions,
    })

    po.res
        .code(code)
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(data)
}

export const esa_dic = async (fastify, options) => {

    fastify.get('/', async (req, res) => {
        {
            po.res = res
        }
        await OnListEntity(
            render_ejs
        )
    })

    fastify.post('/search', async (req, res) => {
        // console.log(new Date().getTime())
        const entityVal = req.body.content // input(text)-name@'content'
        {
            po.res = res
        }
        await OnFindEntity(
            entityVal,
            render_ejs,
        )
    })
}