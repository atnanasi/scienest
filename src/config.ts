const env = Deno.env()

// Application
export const APP_HOST = env.APP_HOST || '127.0.0.1'
export const APP_LOGGING = env.APP_LOGGING || 'debug'
export const APP_PORT = env.APP_PORT || '4000'

// Database
export const DB_HOST = env.DB_HOST || '127.0.0.1'
export const DB_NAME = env.DB_NAME || 'scienest'
export const DB_PASSWORD = env.DB_PASSWORD || 'scienest'
export const DB_PORT = env.DB_PORT || '5432'
export const DB_USERNAME = env.DB_USERNAME || 'scienest'
