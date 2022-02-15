
import { getFileContent } from './tool.js'

export const helloworld = async (fastify, options) => {
    fastify.get('/', async (req, res) => {
        const data = await getFileContent('./api/index.html')
        res
            .code(200)
            .header('Content-Type', 'text/html; charset=utf-8')
            .send(data)
        // return data
        // return { hello: 'world ' + new Date().getTime() }
    })
}

export const posttest = async (fastify, options) => {
    fastify.post('/:id', async (req, res) => {
        console.log('body    ---', req.body)    // from body
        console.log('query   ---', req.query)   // from url
        console.log('params  ---', req.params)  // from /url/:param
        console.log('headers ---', req.headers)
        // console.log('raw     ---', req.raw)
        // console.log('---', req.server)
        // console.log('---', req.id)
        // console.log('---', req.ip)
        // console.log('---', req.ips)
        // console.log('---', req.hostname)
        // console.log('---', req.protocol)
        // console.log('---', req.url)
        // console.log('---', req.routerMethod)
        // console.log('---', req.routerPath)
        // return { hello: 'post1-test' }

        res.send(req.body)
    })
}