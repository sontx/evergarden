export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    mongodb: {
      connectionString: process.env.MONGODB_CONNECTION_STRING,
      databaseName: process.env.MONGODB_DATABASE_NAME
    }
  },
  credentials: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_SECRET
    }
  },
  jwt: {
    auth: {
      secret: "you never know",
      expires: "60m"
    },
    refresh: {
      secret: "now you know",
      expires: "180 days"
    }
  },
  search: {
    elastic: {
      url: "http://localhost:9200",
      username: "elastic",
      password: "admin"
    }
  }
});
