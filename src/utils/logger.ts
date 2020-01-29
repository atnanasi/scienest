import getLogger from 'https://gist.githubusercontent.com/rokoucha/b2db8f7348b0a4cbefea9011dedd0633/raw/CustomizedConsoleLogger.ts'
import { APP_LOGGING } from '../config.ts'

export default await getLogger(APP_LOGGING)
