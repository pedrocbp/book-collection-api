import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from 'middlewares/check-session-id-exists'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import moment from 'moment'

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
        rating: z.number().optional(),
        review: z.string().optional(),
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

  app.get(
    '/metrics',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const books = await knex('books')
        .where('user_id', request.user?.id)
        .select([
          knex.raw('COUNT(*) as totalBooks'),
          knex.raw("COUNT(CASE WHEN status = 'lido' THEN 1 END) as totalRead"),
          knex.raw(
            "COUNT(CASE WHEN status = 'quero_ler' THEN 1 END) as totalWantToRead",
          ),
          knex.raw(
            "COUNT(CASE WHEN status = 'lendo' THEN 1 END) as totalReading",
          ),
        ])
        .first()

      const genreDistribution = await knex('books')
        .where('user_id', request.user?.id)
        .select('genre')
        .groupBy('genre')
        .count('* as count')

      const averageRating = await knex('books')
        .where('user_id', request.user?.id)
        .where('status = lido')
        .avg('rating as averageRating')

      return {
        books,
        genreDistribution,
        averageRating,
      }
    },
  )

  app.delete(
    '/:bookId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, response) => {
      const getBookParamsSchema = z.object({
        bookId: z.string().uuid(),
      })

      const { bookId } = getBookParamsSchema.parse(request.params)

      const book = await knex('books')
        .where('user_id', request.user?.id)
        .where({ id: bookId })
        .first()

      if (!book) {
        return response.status(404).send({ error: 'Book Id not found' })
      }

      await knex('books').where({ id: bookId }).delete()

      return response.status(204).send()
    },
  )

  app.put(
    '/:bookId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, response) => {
      const getBookParamsSchema = z.object({
        bookId: z.string().uuid(),
      })

      const { bookId } = getBookParamsSchema.parse(request.params)

      const updateBookBodySchema = z.object({
        title: z.string().optional(),
        genre: z.string().optional(),
        author: z.string().optional(),
        publicationYear: z.number().optional(),
        status: z.string().optional(),
        rating: z.number().optional(),
        review: z.string().optional(),
      })

      const { title, genre, author, publicationYear, status, rating, review } =
        updateBookBodySchema.parse(request.body)

      const book = await knex('books')
        .where('user_id', request.user?.id)
        .where({ id: bookId })
        .first()

      if (!book) {
        return response.status(404).send({ message: 'Book ID not found.' })
      }

      await knex('books')
        .where({ id: bookId })
        .update({
          title,
          genre,
          author,
          publication_year: publicationYear,
          status,
          rating,
          review,
          updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
      return response.status(204).send()
    },
  )
}
