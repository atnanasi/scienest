import { APP_DEFAULT_SCOPE } from '../config.ts'

export default async ({ response }) => {
  response.body = {
    scienest: 'v1',
    default_scope: APP_DEFAULT_SCOPE,
  }
}
