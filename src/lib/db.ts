import 'server-only';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

// Reuse one connection across hot reloads and serverless invocations.
const globalForMongoose = globalThis as unknown as {
  mongooseConn?: Promise<typeof mongoose>;
};

export async function connectDB() {
  if (!uri) throw new Error('MONGODB_URI is not set. Add it to .env.local');
  globalForMongoose.mongooseConn ??= mongoose.connect(uri, { bufferCommands: false, maxPoolSize: 10 });
  try {
    return await globalForMongoose.mongooseConn;
  } catch (err) {
    globalForMongoose.mongooseConn = undefined; // allow retry on next request
    throw err;
  }
}
