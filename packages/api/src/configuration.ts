export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  isDevelopment: process.env.NODE_ENV === "development",
  database: {
    mongodb: {
      connectionString: process.env.MONGODB_CONNECTION_STRING,
    },
    mysql: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT || 3306,
      databaseName: process.env.MYSQL_DBNAME,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    elastic: {
      url: process.env.ELASTIC_URL,
      username: process.env.ELASTIC_USERNAME,
      password: process.env.ELASTIC_PASSWORD,
    },
  },
  credentials: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_SECRET,
    },
    admin: {
      username: process.env.USER_ADMIN_USERNAME,
      password: process.env.USER_ADMIN_PASSWORD,
    },
  },
  jwt: {
    auth: {
      secret: "you never know",
      expires: "60m",
    },
    refresh: {
      secret: "now you know",
      expires: "180 days",
    },
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
    },
    user: {
      readingFont: "Roboto",
      readingFontSize: "M",
      readingLineSpacing: "M",
    },
  },
  policy: {
    viewCount: {
      minReading: "5s",
      minReadingInterval: "10s",
    },
  },
  upload: {
    dir: "./upload",
    maxFileCount: 1000,
    serveHost: "http://localhost:2000",
  },
});
