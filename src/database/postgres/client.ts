import { Client } from 'https://deno.land/x/postgres/mod.ts'
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from '../../config.ts'

const client = new Client({
  database: DB_DATABASE,
  host: DB_HOST,
  password: DB_PASSWORD,
  port: DB_PORT,
  user: DB_USERNAME,
})

export default client
