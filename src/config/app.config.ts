import 'dotenv/config'

const appConfig = {
  app_name: process.env.APP_NAME ?? '',
  company_name: process.env.COMPANY_NAME ?? '',
  secret: {
    accessKey: process.env.SECRET_ACCESS_KEY ?? '',
    refreshKey: process.env.SECRET_REFRESH_KEY ?? ''
  },
  server: {
    server_host: process.env.SERVER_HOST ?? '',
    server_port: process.env.SERVER_PORT ?? 8001,
    server_url: process.env.SERVER_URL ?? ''
  },
  database: {
    db_host: process.env.DB_HOST ?? '',
    db_port: process.env.DB_PORT ?? '',
    username: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
    db_name: process.env.DB_NAME ?? ''
  },
  admin: {
    mail: process.env.ADMIN ?? '',
    password: process.env.ADMIN_PASSWORD ?? '',
    full_name: process.env.ADMIN_FULLNAME ?? '',
    phone: process.env.ADMIN_PHONE ?? '',
    avatar: process.env.ADMIN_AVATAR ?? '',
    app_password: process.env.ADMIN_APP_PASSWORD ?? '' // App password in gmail
  }
}

export default appConfig
