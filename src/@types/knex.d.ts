// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    user: {
      id: string
      session_id?: string
      name: string
      last_name: string
      email: string
      created_at: string
      updated_at: string
    }
    books: {
      id: string
      user_id?: string
      title: string
      genre: string
      author: string
      publication_year: number
      status: string
      rating?: number
      review?: string
      created_at: string
      updated_at: string
    }
  }
}
