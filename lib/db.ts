import mongoose from "mongoose";
let connection: Promise<typeof mongoose> | undefined;
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required.");
  if (mongoose.connection.readyState === 1) return;
  connection ??= mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 }).catch(error => { connection = undefined; throw error; });
  await connection;
}
