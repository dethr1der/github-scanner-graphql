import 'dotenv/config'

export const config = {
    PORT: process.env.PORT ?? '8080',
    TOKEN: process.env.TOKEN ?? 'your-token-here',
}
