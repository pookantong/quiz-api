export default () => ({
  port: process.env.PORT,
  jwt: {
    expires: process.env.JWT_EXPIRES,
    secret: process.env.JWT_SECRET,
  },
  db: {
    URL: process.env.DATABASE_URL,
  },
  allowedOrigin: process.env.ALLOWED_ORIGIN,
});
