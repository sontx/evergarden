export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  isDevelopment: process.env.NODE_ENV === "development",
  database: {
    mysql: {
      host: process.env.MYSQL_HOST || "mysql",
      port: process.env.MYSQL_PORT || 3306,
      databaseName: process.env.MYSQL_DBNAME || "evergarden",
      username: process.env.MYSQL_USERNAME || "root",
      password: process.env.MYSQL_PASSWORD || "root",
    },
    redis: {
      host: process.env.REDIS_HOST || "redis",
      port: process.env.REDIS_PORT || 6379,
    },
    elastic: {
      url: process.env.ELASTIC_URL || "http://elastic:9200",
      username: process.env.ELASTIC_USERNAME || "elastic",
      password: process.env.ELASTIC_PASSWORD || "changeme",
    },
  },
  storage: {
    host: process.env.STORAGE_HOST || "http://localhost:9000",
    minio: {
      host: process.env.MINIO_HOST || "minio",
      port: process.env.MINIO_PORT || 9000,
      useSSL: process.env.MINIO_USE_SSL || false,
      accessKey: process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_ROOT_PASSWORD,
    },
  },
  credentials: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_SECRET,
    },
    admin: {
      username: process.env.USER_ADMIN_USERNAME || "admin",
      password: process.env.USER_ADMIN_PASSWORD || "admin",
    },
    bot: {
      username: process.env.USER_BOT_USERNAME || "bot",
      password: process.env.USER_BOT_PASSWORD || "bot",
    },
  },
  jwt: {
    auth: {
      secret: process.env.JWT_AUTH_SECRET || "you never know",
      expires: process.env.JWT_AUTH_EXPIRES || "60m",
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET || "now you know",
      expires: process.env.JWT_REFRESH_EXPIRES || "180 days",
    },
  },
  session: {
    secret: process.env.SESSION_SECRET || "you have just known",
    ttl: process.env.SESSION_TTL || "1d",
  },
  settings: {
    sizing: {
      thumbnail: {
        width: 40,
        height: 50,
      },
      cover: {
        maxWidth: 768,
      },
      avatar: {
        width: 128,
        height: 128,
      },
    },
    user: {
      readingFont: "Roboto",
      readingFontSize: "M",
      readingLineSpacing: "M",
    },
  },
  sendMail: {
    host: process.env.SENDMAIL_HOST,
    username: process.env.SENDMAIL_USERNAME,
    password: process.env.SENDMAIL_PASSWORD,
    defaultFrom: process.env.SENDMAIL_DEFAULTFROM,
  },
});
