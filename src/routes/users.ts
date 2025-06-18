import { knex } from '@/database'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      lastName: z.string(),
      email: z.string(),
    })
    const { name, lastName, email } = createUserBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      response.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }
    await knex('users').insert({
      id: randomUUID(),
      name,
      lastName,
      email,
      session_id: sessionId,
    })
    return response.status(201).send()
  })
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const users = await knex('users')
        .select('*')
        .where('session_id', sessionId)
      return {
        users,
      }
    },
  )
}
