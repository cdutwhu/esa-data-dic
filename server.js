import fastifyFac from 'fastify'
import multipart from 'fastify-multipart'
import formbody from 'fastify-formbody'

import { config } from './config.js'
import { helloworld, forum_test } from './api/test.js'

// --- init fastify ---
const fastify = fastifyFac({ logger: true })
fastify.register(multipart)
fastify.register(formbody)

// --- register api functions ---
fastify.register(helloworld)
fastify.register(forum_test)

// --- run the server ---
const start = async () => {
    try {
        await fastify.listen(config.port, config.host)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()