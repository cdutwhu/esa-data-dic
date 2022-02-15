import fastifyFac from 'fastify'
import multipart from 'fastify-multipart'
import formbody from 'fastify-formbody'

import { config } from './config.js'
import { helloworld, posttest } from './api/test.js'

const fastify = fastifyFac({ logger: true })
fastify.register(multipart)
fastify.register(formbody)

fastify.register(helloworld)
fastify.register(posttest)

// Run the server!
const start = async () => {
    try {
        await fastify.listen(config.port, config.host)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()