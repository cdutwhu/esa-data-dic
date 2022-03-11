import { getFileContent } from './tool.js'
import * as ejs from 'ejs'
import * as fs from 'fs'

const template = fs.readFileSync('./www/dictionary.ejs', 'utf-8')
const posts = []

const render_ejs = (res, myposts) => {
    const data = ejs.render(template, {
        title: 'Educational Data Dictionary',
        posts: myposts,
    })
    res
        .code(200)
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(data)
}

export const forum_test = async (fastify, options) => {

    fastify.get('/dictionary', async (req, res) => {
        console.log(posts)
        render_ejs(res, posts)
    })

    fastify.post('/search', async (req, res) => {
        // console.log(new Date().getTime())
        posts.push(req.body.content) // input(text)-name@'content'
        render_ejs(res, posts)
    })
}