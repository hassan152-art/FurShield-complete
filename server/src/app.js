const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // non-browser requests (curl, Postman, health checks)

      const isAllowedExact = allowedOrigins.includes(origin);
      // Allow any deployment of this frontend project — production domain
      // and every preview URL, with or without the team-scope suffix.
      const isFurShieldDeployment = /^https:\/\/fur-shield-complete(-.*)?\.vercel\.app$/.test(origin);

      if (isAllowedExact || isFurShieldDeployment) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
