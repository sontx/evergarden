export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    mongodb: {
      connectionString: process.env.MONGODB_CONNECTION_STRING,
    },
  },
  credentials: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_SECRET,
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
  search: {
    elastic: {
      url: "http://localhost:9200",
      username: "elastic",
      password: "admin",
    },
  },
  settings: {
    maxHistoryCount: 15,
    sizing: {
      thumbnail: {
        width: 40,
        height: 50,
      },
      cover: {
        maxWidth: 768,
      },
    },
  },
  upload: {
    dir: "./upload",
    maxFileCount: 1000,
    serveHost: "http://localhost:2000"
  },
});
