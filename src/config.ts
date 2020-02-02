import $ from 'https://cdn.jsdelivr.net/gh/rokoucha/transform-ts@master/mod.ts'
import { $numericString } from './utils/transformers.ts'

// Application
export const { APP_ENV, APP_HOST, APP_PORT } = $.obj({
  APP_ENV: $.literal('production', 'development'),
  APP_HOST: $.string,
  APP_PORT: $numericString,
}).transformOrThrow(Deno.env())
export const APP_LOGGING = APP_ENV === 'development' ? 'debug' : 'info'

// Database
export const {
  DB_HOST,
  DB_DATABASE,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} = $.obj({
  DB_DATABASE: $.string,
  DB_HOST: $.string,
  DB_PASSWORD: $.string,
  DB_PORT: $numericString,
  DB_USERNAME: $.string,
}).transformOrThrow(Deno.env())
