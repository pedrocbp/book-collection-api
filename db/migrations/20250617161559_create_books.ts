import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('books', (table) => {
    table.uuid('id').primary()
    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNullable()
    table.string('title').notNullable().unique()
    table.string('genre').notNullable()
    table.string('author').notNullable()
    table.integer('publication_year').notNullable()
    table.enum('status', ['lido', 'lendo', 'quero_ler']).notNullable()
    table.integer('rating').unsigned().checkBetween([1, 5])
    table.string('review')

    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()

    table.unique(['title', 'user_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('books')
}
