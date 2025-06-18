import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import cookie from '@fastify/cookie'
import { booksRoutes } from './routes/books'
export const app = fastify()

app.register(cookie)

app.addHook('preHandler', async (request) => {
  console.log(`[${request.method}] ${request.url}`)
})

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(booksRoutes, {
  prefix: 'books',
})
