module.exports = {
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    logging: false,
    entities: [ './server/entities/**/*.ts' ],
    migrations: [ './server/db/migrations/**/*.ts' ],
    subscribers: [ './server/db/subscribers/**/*.ts' ],
    cli: {
        entitiesDir: './server/entities',
        migrationsDir: './server/db/migrations',
        subscribersDir: './server/db/subscribers',
    },
}