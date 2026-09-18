import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  // On Vercel, process.exit(1) would kill the whole serverless container
  // instead of just failing the request, so we throw there and only
  // exit(1) for local `npm run dev`.
  const isServerless = Boolean(process.env.VERCEL);

  if (!uri) {
    console.error("MONGO_URI is not set. Check server/.env");
    if (isServerless) throw new Error("MONGO_URI is not set");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(uri, {
      family: 4,
      tls: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 5,
      retryWrites: true,
      retryReads: true
    });

    await mongoose.connection.db.admin().command({ ping: 1 });

    console.log("MongoDB Atlas connected and ping successful");
  } catch (error) {
    console.error("MongoDB connection error:");
    console.error(error);
    if (isServerless) throw error;
    process.exit(1);
  }
}