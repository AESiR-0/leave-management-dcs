// lib/mongo.ts
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI!);

export async function connectToDatabase() {
  if (!client.isConnected()) {
    await client.connect();
  }
  const db = client.db("leaveRequestsDB"); // Replace with your actual DB name
  return db;
}
