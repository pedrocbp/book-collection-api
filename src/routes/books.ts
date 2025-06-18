import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from 'middlewares/check-session-id-exists'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function booksRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, response) => {
      const createBookBodySchema = z.object({
        title: z.string(),
        genre: z.string(),
        author: z.string(),
        publicationYear: z.number(),
        status: z.string(),
        rating: z.number(),
        review: z.string(),
      })

      const { title, genre, author, publicationYear, status, rating, review } =
        createBookBodySchema.parse(request.body)

      await knex('books').insert({
        id: randomUUID(),
        user_id: request.user?.id,
        title,
        genre,
        author,
        publication_year: publicationYear,
        status,
        rating,
        review,
      })
      return response.status(201).send()
    },
  )

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const filterQuerySchema = z.object({
        genre: z.string().optional(),
        status: z.string().optional(),
        rating: z.number().optional(),
        orderBy: z.string().optional(),
      })

      const { genre, status, rating, orderBy } = filterQuerySchema.parse(
        request.query,
      )

      const booksQuery = knex('books')
        .select('*')
        .where('user_id', request.user?.id)

      if (genre) {
        booksQuery.andWhere('genre', genre)
      }

      if (status) {
        booksQuery.andWhere('status', status)
      }

      if (rating) {
        booksQuery.andWhere('rating', rating)
      }

      if (orderBy) {
        booksQuery.orderBy(orderBy)
      }

      const books = await booksQuery.orderBy('created_at')

      return books
    },
  )
}
