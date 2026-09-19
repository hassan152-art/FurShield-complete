const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // non-browser requests (curl, Postman, health checks)

      const isAllowedExact = allowedOrigins.includes(origin);
      // Allow any deployment under this Vercel team/scope (production and
      // every preview URL), so we don't have to chase a new hash each deploy.
      const isVercelTeamDeployment = /^https:\/\/.*-hassan-857d\.vercel\.app$/.test(origin);

      if (isAllowedExact || isVercelTeamDeployment) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
