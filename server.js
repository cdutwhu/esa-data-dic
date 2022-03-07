import path from 'path'
import { fileURLToPath } from 'url';
import fastifyFac from 'fastify'
import multipart from 'fastify-multipart'
import formbody from 'fastify-formbody'
import stat from 'fastify-static'

import { config } from './config.js'
import { helloworld, forum_test } from './api/test/rest-test.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// console.log(__filename)
// console.log(__dirname)

// --- init fastify --- //
const fastify = fastifyFac({ logger: true })
fastify.register(multipart)
fastify.register(formbody)

// --- register api functions --- //
fastify.register(helloworld)
fastify.register(forum_test)
fastify.register(stat, {
    root: path.join(__dirname, 'www'),
    prefix: '/', // optional: default '/'
})

// --- run the server --- //
const start = async () => {
    try {
        await fastify.listen(config.port, config.host)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()